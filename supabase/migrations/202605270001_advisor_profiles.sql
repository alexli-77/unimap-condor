create extension if not exists pgcrypto;

create table if not exists public.institution_profiles (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  aliases text[] not null default '{}',
  country text,
  region text,
  city text,
  ror_id text,
  openalex_id text,
  website_url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academic_programs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institution_profiles(id) on delete cascade,
  name text not null,
  degree_level text,
  department text,
  subjects text[] not null default '{}',
  application_deadlines jsonb not null default '{}',
  tuition jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, name, degree_level)
);

create table if not exists public.faculty_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  titles text[] not null default '{}',
  department text,
  lab text,
  emails text[] not null default '{}',
  profile_url text,
  lab_url text,
  scholar_url text,
  research_areas text[] not null default '{}',
  methods text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faculty_affiliations (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculty_profiles(id) on delete cascade,
  institution_id uuid not null references public.institution_profiles(id) on delete cascade,
  department text,
  lab text,
  role text,
  is_primary boolean not null default true,
  metadata jsonb not null default '{}',
  unique (faculty_id, institution_id, department, lab)
);

create table if not exists public.faculty_program_fits (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculty_profiles(id) on delete cascade,
  program_id uuid references public.academic_programs(id) on delete set null,
  program_name text,
  priority text,
  priority_score integer,
  fit_summary text not null,
  contact_angle text,
  target_programs text[] not null default '{}',
  political_sensitivity text,
  recruiting_signal text,
  outreach_status text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_id, program_id, program_name)
);

create table if not exists public.advisor_sources (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculty_profiles(id) on delete cascade,
  source_label text not null,
  source_path text,
  source_url text,
  observed_at date,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (faculty_id, source_label, source_path)
);

create or replace view public.university_advisor_cards as
select
  fp.id,
  fp.slug,
  fp.full_name,
  coalesce(fp.titles[1], '') as title,
  ip.canonical_name as institution_name,
  ip.aliases as institution_aliases,
  coalesce(fa.department, fp.department) as department,
  coalesce(fa.lab, fp.lab) as lab,
  fp.profile_url,
  fp.research_areas,
  fp.is_active,
  fpf.priority,
  fpf.priority_score,
  fpf.fit_summary,
  fpf.contact_angle,
  fpf.target_programs,
  fpf.political_sensitivity,
  fpf.recruiting_signal,
  fpf.outreach_status,
  src.source_label
from public.faculty_profiles fp
join public.faculty_affiliations fa on fa.faculty_id = fp.id
join public.institution_profiles ip on ip.id = fa.institution_id
left join public.faculty_program_fits fpf on fpf.faculty_id = fp.id
left join lateral (
  select source_label
  from public.advisor_sources s
  where s.faculty_id = fp.id
  order by s.observed_at desc nulls last, s.created_at desc
  limit 1
) src on true;

alter table public.institution_profiles enable row level security;
alter table public.academic_programs enable row level security;
alter table public.faculty_profiles enable row level security;
alter table public.faculty_affiliations enable row level security;
alter table public.faculty_program_fits enable row level security;
alter table public.advisor_sources enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'institution_profiles'
      and policyname = 'institution_profiles_public_read'
  ) then
    create policy institution_profiles_public_read
      on public.institution_profiles for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'academic_programs'
      and policyname = 'academic_programs_public_read'
  ) then
    create policy academic_programs_public_read
      on public.academic_programs for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'faculty_profiles'
      and policyname = 'faculty_profiles_public_read'
  ) then
    create policy faculty_profiles_public_read
      on public.faculty_profiles for select using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'faculty_affiliations'
      and policyname = 'faculty_affiliations_public_read'
  ) then
    create policy faculty_affiliations_public_read
      on public.faculty_affiliations for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'faculty_program_fits'
      and policyname = 'faculty_program_fits_public_read'
  ) then
    create policy faculty_program_fits_public_read
      on public.faculty_program_fits for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'advisor_sources'
      and policyname = 'advisor_sources_public_read'
  ) then
    create policy advisor_sources_public_read
      on public.advisor_sources for select using (true);
  end if;
end $$;
