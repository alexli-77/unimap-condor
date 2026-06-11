#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


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
