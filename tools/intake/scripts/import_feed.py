#!/usr/bin/env python3
import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests


def env(name):
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value.rstrip("/")


def get_supabase_key():
    return os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")


def headers(api_key, prefer=None):
    result = {
        "apikey": api_key,
        "content-type": "application/json",
    }
    if not api_key.startswith("sb_secret_"):
        result["authorization"] = f"Bearer {api_key}"
    if prefer:
        result["prefer"] = prefer
    return result


def post_json(url, service_role_key, table, payload, prefer="return=representation"):
    response = requests.post(
        f"{url}/rest/v1/{table}",
        headers=headers(service_role_key, prefer),
        data=json.dumps(payload),
        timeout=30,
    )
    if response.status_code >= 400:
        raise RuntimeError(f"{table} insert failed: {response.status_code} {response.text}")
    return response.json() if response.text else []


def upsert_source(url, service_role_key, item):
    payload = {
        "institution_name": item.get("university_name") or None,
        "source_type": item["source_type"],
        "source_url": item["source_url"],
        "page_title": item.get("page_title") or None,
        "last_seen_at": item.get("extracted_at"),
        "metadata": item.get("metadata") or {},
    }
    rows = post_json(
        url,
        service_role_key,
        "intake_sources?on_conflict=source_type,source_url",
        payload,
        prefer="resolution=merge-duplicates,return=representation",
    )
    return rows[0]


def insert_run(url, service_role_key, source_id, item):
    payload = {
        "source_id": source_id,
        "spider_name": item.get("spider_name") or "unknown",
        "started_at": item.get("extracted_at"),
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "status": "imported",
        "item_count": len(item.get("records") or []),
        "metadata": {"raw_text_hash": item.get("raw_text_hash")},
    }
    rows = post_json(url, service_role_key, "intake_runs", payload)
    return rows[0]


def record_key(record):
    for key in ["profile_url", "application_url", "email", "name", "topic"]:
        value = record.get(key)
        if value:
            return str(value)[:300]
    return (record.get("raw_label") or "")[:300]


def insert_records(url, service_role_key, source_id, run_id, item):
    records = item.get("records") or []
    if not records:
        return 0

    payload = []
    for record in records:
        payload.append(
            {
                "source_id": source_id,
                "run_id": run_id,
                "record_type": record.get("record_type") or item["source_type"],
                "record_key": record_key(record),
                "extracted_json": record,
                "raw_text": record.get("raw_label") or item.get("raw_text") or "",
                "raw_text_hash": item.get("raw_text_hash"),
                "confidence": item.get("confidence") or 0.4,
                "review_status": item.get("review_status") or "draft",
            }
        )

    post_json(
        url,
        service_role_key,
        "intake_extracted_records?on_conflict=source_id,record_type,record_key,raw_text_hash",
        payload,
        prefer="resolution=merge-duplicates,return=minimal",
    )
    return len(payload)


def import_feed(path):
    supabase_url = env("SUPABASE_URL")
    service_role_key = get_supabase_key()
    if not service_role_key:
        raise RuntimeError("Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY")
    imported = 0

    with Path(path).open("r", encoding="utf-8") as file:
        for line_no, line in enumerate(file, start=1):
            if not line.strip():
                continue
            item = json.loads(line)
            source = upsert_source(supabase_url, service_role_key, item)
            run = insert_run(supabase_url, service_role_key, source["id"], item)
            imported += insert_records(
                supabase_url, service_role_key, source["id"], run["id"], item
            )
            print(f"line {line_no}: imported {len(item.get('records') or [])} records")

    print(f"done: imported {imported} extracted records")


def main():
    parser = argparse.ArgumentParser(description="Import Scrapy JSONL feed into Supabase staging tables.")
    parser.add_argument("feed", help="Path to a Scrapy JSONL feed")
    args = parser.parse_args()

    try:
        import_feed(args.feed)
    except Exception as error:
        print(f"error: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
