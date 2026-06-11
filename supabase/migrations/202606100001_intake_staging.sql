create extension if not exists pgcrypto;

create table if not exists public.intake_sources (
  id uuid primary key default gen_random_uuid(),
  institution_name text,
  source_type text not null check (
    source_type in ('faculty', 'program', 'tuition_funding', 'other')
  ),
  source_url text not null,
  page_title text,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, source_url)
);

create table if not exists public.intake_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.intake_sources(id) on delete cascade,
  spider_name text not null,
  started_at timestamptz,
  finished_at timestamptz,
  status text not null default 'started' check (
    status in ('started', 'imported', 'failed')
  ),
  item_count integer not null default 0,
  error text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.intake_extracted_records (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.intake_sources(id) on delete cascade,
  run_id uuid references public.intake_runs(id) on delete set null,
  record_type text not null check (
    record_type in ('faculty_member', 'program', 'tuition_funding', 'other')
  ),
  record_key text not null,
  extracted_json jsonb not null default '{}',
  raw_text text,
  raw_text_hash text,
  confidence numeric(4, 3) not null default 0.400,
  review_status text not null default 'draft' check (
    review_status in ('draft', 'needs_review', 'verified', 'rejected')
  ),
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, record_type, record_key, raw_text_hash)
);

create index if not exists intake_sources_institution_idx
  on public.intake_sources (institution_name);

create index if not exists intake_records_review_status_idx
  on public.intake_extracted_records (review_status);

create index if not exists intake_records_record_type_idx
  on public.intake_extracted_records (record_type);

create index if not exists intake_records_extracted_json_gin_idx
  on public.intake_extracted_records using gin (extracted_json);

alter table public.intake_sources enable row level security;
alter table public.intake_runs enable row level security;
alter table public.intake_extracted_records enable row level security;

comment on table public.intake_sources is
  'Source pages used by the UniMap data intake workflow. Draft data is intentionally not public.';

comment on table public.intake_runs is
  'Scrapy/import runs for a single source page.';

comment on table public.intake_extracted_records is
  'Candidate extracted records from source pages. Records must be reviewed before front-end use.';
