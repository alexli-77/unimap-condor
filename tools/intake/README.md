# UniMap Data Intake

This is the internal data intake workflow for UniMap Condor. It collects candidate
school data from official university pages, stores it as draft staging data, and
keeps review separate from the public map experience.

Most daily use should go through the local UI:

```bash
tools/intake/run_ui.sh
```

Open:

```text
http://127.0.0.1:8765/
```

The first version is intentionally semi-automatic:

1. Run a focused spider against a known official URL.
2. Export candidate records to JSONL.
3. Import the JSONL into Supabase staging tables.
4. Review records manually.
5. Promote only verified records into the front-end data path later.

## Install

Scrapy 2.16 requires Python 3.10 or newer. Use a Python 3.10+ interpreter for
the virtual environment.

```bash
cd tools/intake/scrapy
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

After this, start the UI:

```bash
cd /path/to/unimap-condor
tools/intake/run_ui.sh
```

The UI lets you:

- save Supabase URL and a Secret API key to the local ignored `.env`
- choose Faculty, Program, or Tuition/Funding
- enter a university and official page URL
- run the spider
- preview the generated JSONL
- import the selected feed into Supabase staging

## Run Spiders

The UI is preferred. These commands are the lower-level CLI fallback.

Faculty directory:

```bash
scrapy crawl faculty \
  -a university="Universite de Montreal" \
  -a start_url="https://diro.umontreal.ca/repertoire-departement/professeurs/"
```

Program page:

```bash
scrapy crawl program \
  -a university="Example University" \
  -a start_url="https://example.edu/programs/computer-science"
```

Tuition or funding page:

```bash
scrapy crawl tuition \
  -a university="Example University" \
  -a start_url="https://example.edu/tuition-and-fees"
```

By default Scrapy writes JSONL feeds under:

```text
tools/intake/scrapy/output/
```

These output files are ignored by git because they may contain raw third-party
page text and review notes.

## Import To Supabase

Apply the migration:

```bash
supabase db push
```

Configure server-side credentials locally:

Preferred: open the local UI and fill the Supabase section.

Manual fallback:

```bash
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

The UI writes these values to `tools/intake/.env`. Never commit that file.

Import a feed:

```bash
set -a
source tools/intake/.env
set +a
python tools/intake/scripts/import_feed.py tools/intake/scrapy/output/faculty-*.jsonl
```

The import writes to:

- `intake_sources`
- `intake_runs`
- `intake_extracted_records`

All records start as `draft`. Front-end features should only use reviewed
records after they are marked `verified`.

## Review Rules

- Keep the original `source_url`.
- Do not trust extracted tuition/funding claims without checking the official page.
- Prefer small, source-backed records over large copied page blobs.
- Reject records with unclear identity, stale program names, or ambiguous amounts.
- Use notes to capture interpretation, not copied website paragraphs.
