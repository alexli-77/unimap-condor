#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/scrapy"

if [ ! -x ".venv/bin/python" ]; then
  echo "Missing .venv. Run:"
  echo "  cd tools/intake/scrapy"
  echo "  python3.12 -m venv .venv"
  echo "  source .venv/bin/activate"
  echo "  pip install -r requirements.txt"
  exit 1
fi

exec .venv/bin/python ../app.py
