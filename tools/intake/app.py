#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import requests


ROOT = Path(__file__).resolve().parent
SCRAPY_DIR = ROOT / "scrapy"
OUTPUT_DIR = SCRAPY_DIR / "output"
UI_DIR = ROOT / "ui"
IMPORT_SCRIPT = ROOT / "scripts" / "import_feed.py"
ENV_FILE = ROOT / ".env"
SPIDERS = {
    "faculty": "faculty",
    "udem_professors": "udem_professors",
    "program": "program",
    "tuition_funding": "tuition",
}
REVIEW_STATUSES = {"draft", "needs_review", "verified", "rejected"}
REVIEW_RECORD_TYPES = {"faculty_member", "program", "tuition_funding", "other"}


def load_env_file():
    env = os.environ.copy()
    if not ENV_FILE.exists():
        return env
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def get_saved_config():
    env = load_env_file()
    service_role_key = env.get("SUPABASE_SECRET_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    key_kind = "secret" if service_role_key.startswith("sb_secret_") else "legacy" if service_role_key else ""
    return {
        "supabaseUrl": env.get("SUPABASE_URL") or "",
        "hasSecretKey": bool(service_role_key),
        "keyKind": key_kind,
        "secretKeyPreview": redact_key(service_role_key),
    }


def redact_key(value):
    if not value:
        return ""
    if len(value) <= 10:
        return "saved"
    return f"{value[:6]}...{value[-4:]}"


def save_config(supabase_url, secret_key):
    supabase_url = (supabase_url or "").strip().rstrip("/")
    secret_key = (secret_key or "").strip()
    if supabase_url and not supabase_url.startswith("https://"):
        raise ValueError("Supabase URL should start with https://")
    if not supabase_url or not secret_key:
        raise ValueError("Both Supabase URL and secret API key are required")

    ENV_FILE.write_text(
        "\n".join(
            [
                f"SUPABASE_URL={supabase_url}",
                f"SUPABASE_SECRET_KEY={secret_key}",
                "",
            ]
        ),
        encoding="utf-8",
    )


def get_supabase_credentials():
    env = load_env_file()
    supabase_url = (env.get("SUPABASE_URL") or "").rstrip("/")
    api_key = env.get("SUPABASE_SECRET_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    if not supabase_url or not api_key:
        raise ValueError("Save Supabase config before reviewing records")
    if not api_key.startswith("sb_secret_"):
        raise ValueError("Use a new Supabase Secret API key that starts with sb_secret_")
    return supabase_url, api_key


def supabase_headers(api_key, prefer=None):
    headers = {
        "apikey": api_key,
        "content-type": "application/json",
    }
    if not api_key.startswith("sb_secret_"):
        headers["authorization"] = f"Bearer {api_key}"
    if prefer:
        headers["prefer"] = prefer
    return headers


def supabase_request(method, table, params=None, payload=None, prefer=None):
    supabase_url, api_key = get_supabase_credentials()
    response = requests.request(
        method,
        f"{supabase_url}/rest/v1/{table}",
        headers=supabase_headers(api_key, prefer),
        params=params or {},
        data=json.dumps(payload) if payload is not None else None,
        timeout=30,
    )
    if response.status_code >= 400:
        raise ValueError(f"Supabase request failed: {response.status_code} {response.text}")
    data = response.json() if response.text else []
    return data, response.headers


def parse_total_count(headers, fallback):
    content_range = headers.get("content-range") or headers.get("Content-Range") or ""
    if "/" not in content_range:
        return fallback
    total = content_range.rsplit("/", 1)[-1]
    return fallback if total == "*" else int(total)


def in_filter(values):
    return f"in.({','.join(values)})"


def unique(values):
    seen = set()
    output = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            output.append(value)
    return output


def fetch_sources(source_ids):
    ids = unique([source_id for source_id in source_ids if source_id])
    if not ids:
        return {}
    rows, _ = supabase_request(
        "GET",
        "intake_sources",
        params={
            "select": "id,institution_name,source_type,source_url,page_title",
            "id": in_filter(ids),
        },
    )
    return {row["id"]: row for row in rows}


def get_matching_source_ids(institution=None, source_type=None):
    params = {"select": "id"}
    if institution:
        params["institution_name"] = f"ilike.*{institution}*"
    if source_type:
        params["source_type"] = f"eq.{source_type}"
    if len(params) == 1:
        return None
    rows, _ = supabase_request("GET", "intake_sources", params=params)
    return [row["id"] for row in rows]


def normalize_review_record(row, source=None):
    extracted = row.get("extracted_json") or {}
    source = source or {}
    return {
        "id": row["id"],
        "sourceId": row.get("source_id"),
        "recordKey": row.get("record_key"),
        "recordType": row.get("record_type"),
        "reviewStatus": row.get("review_status"),
        "confidence": row.get("confidence"),
        "notes": row.get("notes") or "",
        "createdAt": row.get("created_at"),
        "updatedAt": row.get("updated_at"),
        "institutionName": source.get("institution_name") or "",
        "sourceType": source.get("source_type") or "",
        "sourceUrl": source.get("source_url") or "",
        "name": extracted.get("name") or extracted.get("full_name") or row.get("record_key"),
        "facultyName": extracted.get("faculty_name") or "",
        "departmentName": extracted.get("department_name") or extracted.get("department") or "",
        "profileUrl": extracted.get("profile_url") or "",
        "email": extracted.get("email") or "",
        "researchAreas": extracted.get("research_areas") or extracted.get("expertise") or [],
        "extractedJson": extracted,
    }


def build_review_query(query_params):
    status = (query_params.get("status", ["draft"])[0] or "draft").strip()
    record_type = (query_params.get("recordType", ["faculty_member"])[0] or "faculty_member").strip()
    if status != "all" and status not in REVIEW_STATUSES:
        raise ValueError("Unknown review status")
    if record_type != "all" and record_type not in REVIEW_RECORD_TYPES:
        raise ValueError("Unknown record type")

    params = {
        "select": "id,source_id,record_key,record_type,review_status,confidence,notes,extracted_json,created_at,updated_at",
        "order": "updated_at.desc",
    }
    if status != "all":
        params["review_status"] = f"eq.{status}"
    if record_type != "all":
        params["record_type"] = f"eq.{record_type}"

    department = (query_params.get("department", [""])[0] or "").strip()
    faculty = (query_params.get("faculty", [""])[0] or "").strip()
    search = (query_params.get("q", [""])[0] or "").strip()
    if department:
        params["extracted_json->>department_name"] = f"eq.{department}"
    if faculty:
        params["extracted_json->>faculty_name"] = f"eq.{faculty}"
    if search:
        params["or"] = (
            f"(extracted_json->>name.ilike.*{search}*,"
            f"extracted_json->>full_name.ilike.*{search}*,"
            f"record_key.ilike.*{search}*)"
        )

    source_ids = get_matching_source_ids(
        institution=(query_params.get("institution", [""])[0] or "").strip(),
        source_type=(query_params.get("sourceType", [""])[0] or "").strip(),
    )
    if source_ids is not None:
        if not source_ids:
            params["source_id"] = "in.(00000000-0000-0000-0000-000000000000)"
        else:
            params["source_id"] = in_filter(source_ids)

    limit = min(max(int(query_params.get("limit", ["50"])[0] or 50), 1), 200)
    offset = max(int(query_params.get("offset", ["0"])[0] or 0), 0)
    params["limit"] = str(limit)
    params["offset"] = str(offset)
    return params, limit, offset


def fetch_review_records(query_params):
    params, limit, offset = build_review_query(query_params)
    rows, headers = supabase_request(
        "GET",
        "intake_extracted_records",
        params=params,
        prefer="count=exact",
    )
    sources = fetch_sources([row.get("source_id") for row in rows])
    records = [normalize_review_record(row, sources.get(row.get("source_id"))) for row in rows]
    total = parse_total_count(headers, len(records))
    return {
        "records": records,
        "total": total,
        "limit": limit,
        "offset": offset,
        "hasMore": offset + limit < total,
    }


def fetch_review_summary(query_params):
    status = (query_params.get("status", ["draft"])[0] or "draft").strip()
    record_type = (query_params.get("recordType", ["faculty_member"])[0] or "faculty_member").strip()
    rows = []
    page_size = 1000
    offset = 0
    while True:
        params = {
            "select": "id,source_id,record_type,review_status,extracted_json",
            "order": "updated_at.desc",
            "limit": str(page_size),
            "offset": str(offset),
        }
        if status != "all":
            params["review_status"] = f"eq.{status}"
        if record_type != "all":
            params["record_type"] = f"eq.{record_type}"
        page_rows, _ = supabase_request("GET", "intake_extracted_records", params=params)
        rows.extend(page_rows)
        if len(page_rows) < page_size:
            break
        offset += page_size

    sources = fetch_sources([row.get("source_id") for row in rows])

    status_counts = {}
    institutions = {}
    faculties = {}
    departments = {}
    for row in rows:
        extracted = row.get("extracted_json") or {}
        source = sources.get(row.get("source_id"), {})
        status_key = row.get("review_status") or "unknown"
        institution = source.get("institution_name") or "Unknown institution"
        faculty = extracted.get("faculty_name") or "Unknown faculty"
        department = (
            extracted.get("department_name")
            or extracted.get("department")
            or "Unknown department"
        )
        status_counts[status_key] = status_counts.get(status_key, 0) + 1
        institutions[institution] = institutions.get(institution, 0) + 1
        faculties[faculty] = faculties.get(faculty, 0) + 1
        departments[department] = departments.get(department, 0) + 1

    def top_items(items, limit=40):
        return [
            {"name": name, "count": count}
            for name, count in sorted(items.items(), key=lambda item: (-item[1], item[0]))[:limit]
        ]

    return {
        "total": len(rows),
        "statuses": status_counts,
        "institutions": top_items(institutions),
        "faculties": top_items(faculties),
        "departments": top_items(departments, 80),
    }


def update_review_status(ids, status, notes=None):
    if status not in REVIEW_STATUSES:
        raise ValueError("Unknown review status")
    ids = unique([str(item) for item in ids if item])
    if not ids:
        raise ValueError("Select at least one record")
    payload = {
        "review_status": status,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    if status == "verified":
        payload["verified_at"] = datetime.now(timezone.utc).isoformat()
    elif status in {"draft", "needs_review", "rejected"}:
        payload["verified_at"] = None
    if notes is not None:
        payload["notes"] = notes
    rows, _ = supabase_request(
        "PATCH",
        "intake_extracted_records",
        params={"id": in_filter(ids)},
        payload=payload,
        prefer="return=representation",
    )
    return {"updated": len(rows), "records": rows}


def update_review_record(record_id, extracted_json=None, notes=None):
    if not record_id:
        raise ValueError("Missing record id")
    payload = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if extracted_json is not None:
        if not isinstance(extracted_json, dict):
            raise ValueError("extractedJson must be an object")
        payload["extracted_json"] = extracted_json
    if notes is not None:
        payload["notes"] = notes
    rows, _ = supabase_request(
        "PATCH",
        "intake_extracted_records",
        params={"id": f"eq.{record_id}"},
        payload=payload,
        prefer="return=representation",
    )
    if not rows:
        raise ValueError("Record was not updated")
    sources = fetch_sources([rows[0].get("source_id")])
    return normalize_review_record(rows[0], sources.get(rows[0].get("source_id")))


def list_feeds():
    feeds = []
    for path in sorted(OUTPUT_DIR.glob("*.jsonl"), key=lambda item: item.stat().st_mtime, reverse=True):
        summary = summarize_feed(path)
        feeds.append(
            {
                "name": path.name,
                "size": path.stat().st_size,
                "modified": path.stat().st_mtime,
                **summary,
            }
        )
    return feeds


def summarize_feed(path):
    pages = 0
    records = 0
    source_types = set()
    universities = set()
    try:
      with path.open("r", encoding="utf-8") as file:
          for line in file:
              if not line.strip():
                  continue
              pages += 1
              item = json.loads(line)
              records += len(item.get("records") or [])
              if item.get("source_type"):
                  source_types.add(item["source_type"])
              if item.get("university_name"):
                  universities.add(item["university_name"])
    except Exception as error:
        return {"pages": pages, "records": records, "error": str(error)}
    return {
        "pages": pages,
        "records": records,
        "sourceTypes": sorted(source_types),
        "universities": sorted(universities),
    }


def read_feed(name, limit=5):
    path = safe_feed_path(name)
    rows = []
    with path.open("r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():
                continue
            rows.append(json.loads(line))
            if len(rows) >= limit:
                break
    return {"name": path.name, "summary": summarize_feed(path), "rows": rows}


def safe_feed_path(name):
    path = (OUTPUT_DIR / name).resolve()
    if OUTPUT_DIR.resolve() not in path.parents or path.suffix != ".jsonl" or not path.exists():
        raise ValueError("Unknown feed file")
    return path


class IntakeHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/status":
            config = get_saved_config()
            self.send_json(
                {
                    "python": sys.version.split()[0],
                    "executable": sys.executable,
                    "scrapyAvailable": self.scrapy_available(),
                    "feeds": list_feeds(),
                    "hasSupabaseEnv": bool(
                        config["supabaseUrl"] and config["hasSecretKey"] and config["keyKind"] == "secret"
                    ),
                    "supabaseKeyKind": config["keyKind"],
                }
            )
            return
        if parsed.path == "/api/config":
            self.send_json(get_saved_config())
            return
        if parsed.path == "/api/feed":
            params = parse_qs(parsed.query)
            try:
                self.send_json(read_feed(params.get("name", [""])[0]))
            except Exception as error:
                self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)
            return
        if parsed.path == "/api/review":
            try:
                self.send_json(fetch_review_records(parse_qs(parsed.query)))
            except Exception as error:
                self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)
            return
        if parsed.path == "/api/review/summary":
            try:
                self.send_json(fetch_review_summary(parse_qs(parsed.query)))
            except Exception as error:
                self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)
            return
        self.serve_static(parsed.path)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/run":
            self.handle_run()
            return
        if parsed.path == "/api/import":
            self.handle_import()
            return
        if parsed.path == "/api/config":
            self.handle_config()
            return
        if parsed.path == "/api/review/status":
            self.handle_review_status()
            return
        if parsed.path == "/api/review/record":
            self.handle_review_record()
            return
        self.send_error_json("Not found", HTTPStatus.NOT_FOUND)

    def handle_config(self):
        try:
            payload = self.read_json()
            save_config(payload.get("supabaseUrl"), payload.get("secretKey"))
            self.send_json({"ok": True, **get_saved_config()})
        except Exception as error:
            self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)

    def handle_run(self):
        try:
            payload = self.read_json()
            source_type = payload.get("sourceType")
            spider = SPIDERS.get(source_type)
            university = (payload.get("university") or "").strip()
            start_url = (payload.get("url") or "").strip()
            if not spider:
                raise ValueError("Choose Faculty, UdeM Professors, Program, or Tuition/Funding")
            if not start_url.startswith(("http://", "https://")):
                raise ValueError("Enter a valid http(s) URL")

            command = [
                sys.executable,
                "-m",
                "scrapy",
                "crawl",
                spider,
                "-L",
                "INFO",
                "-a",
                f"university={university}",
                "-a",
                f"start_url={start_url}",
            ]
            result = subprocess.run(
                command,
                cwd=SCRAPY_DIR,
                text=True,
                capture_output=True,
                timeout=180,
            )
            self.send_json(
                {
                    "ok": result.returncode == 0,
                    "command": " ".join(command),
                    "returnCode": result.returncode,
                    "stdout": result.stdout[-8000:],
                    "stderr": result.stderr[-8000:],
                    "feeds": list_feeds(),
                },
                status=HTTPStatus.OK if result.returncode == 0 else HTTPStatus.BAD_REQUEST,
            )
        except subprocess.TimeoutExpired:
            self.send_error_json("Spider timed out after 180 seconds", HTTPStatus.REQUEST_TIMEOUT)
        except Exception as error:
            self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)

    def handle_import(self):
        try:
            payload = self.read_json()
            feed = safe_feed_path(payload.get("feed") or "")
            env = load_env_file()
            saved_key = env.get("SUPABASE_SECRET_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY")
            if not env.get("SUPABASE_URL") or not saved_key:
                raise ValueError("Save Supabase config before importing")
            if not saved_key.startswith("sb_secret_"):
                raise ValueError(
                    "This looks like a legacy service_role key. Use a new Supabase Secret API key that starts with sb_secret_."
                )
            result = subprocess.run(
                [sys.executable, str(IMPORT_SCRIPT), str(feed)],
                cwd=ROOT.parent.parent,
                text=True,
                capture_output=True,
                timeout=180,
                env=env,
            )
            self.send_json(
                {
                    "ok": result.returncode == 0,
                    "returnCode": result.returncode,
                    "stdout": result.stdout[-8000:],
                    "stderr": result.stderr[-8000:],
                },
                status=HTTPStatus.OK if result.returncode == 0 else HTTPStatus.BAD_REQUEST,
            )
        except Exception as error:
            self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)

    def handle_review_status(self):
        try:
            payload = self.read_json()
            self.send_json(
                {
                    "ok": True,
                    **update_review_status(
                        payload.get("ids") or [],
                        payload.get("status") or "",
                        payload.get("notes"),
                    ),
                }
            )
        except Exception as error:
            self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)

    def handle_review_record(self):
        try:
            payload = self.read_json()
            self.send_json(
                {
                    "ok": True,
                    "record": update_review_record(
                        payload.get("id"),
                        payload.get("extractedJson"),
                        payload.get("notes"),
                    ),
                }
            )
        except Exception as error:
            self.send_error_json(str(error), HTTPStatus.BAD_REQUEST)

    def serve_static(self, path):
        requested = "index.html" if path in ("", "/") else path.lstrip("/")
        file_path = (UI_DIR / requested).resolve()
        if UI_DIR.resolve() not in file_path.parents and file_path != (UI_DIR / "index.html").resolve():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if not file_path.exists() or file_path.is_dir():
            file_path = UI_DIR / "index.html"
        content_type = "text/html; charset=utf-8"
        if file_path.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif file_path.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"
        data = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("content-type", content_type)
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def scrapy_available(self):
        result = subprocess.run(
            [sys.executable, "-m", "scrapy", "version"],
            cwd=SCRAPY_DIR,
            text=True,
            capture_output=True,
        )
        return result.returncode == 0

    def read_json(self):
        length = int(self.headers.get("content-length", "0"))
        return json.loads(self.rfile.read(length).decode("utf-8") or "{}")

    def send_json(self, payload, status=HTTPStatus.OK):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_error_json(self, message, status):
        self.send_json({"ok": False, "error": message}, status=status)

    def log_message(self, format, *args):
        print(f"[intake] {self.address_string()} - {format % args}")


def main():
    port = int(os.environ.get("INTAKE_PORT", "8765"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", port), IntakeHandler)
    print(f"UniMap Intake UI: http://127.0.0.1:{port}/")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()
