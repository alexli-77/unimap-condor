create or replace view public.university_faculty_directory_public
with (security_invoker = true) as
with normalized_records as (
  select
    r.id,
    r.record_key,
    s.institution_name,
    array[]::text[] as institution_aliases,
    coalesce(r.extracted_json->>'name', r.extracted_json->>'full_name') as full_name,
    coalesce(r.extracted_json->>'faculty_name', '') as faculty_name,
    coalesce(r.extracted_json->>'department_name', r.extracted_json->>'department', '') as department_name,
    coalesce(r.extracted_json->>'title', r.extracted_json->>'role', '') as role,
    nullif(r.extracted_json->>'email', '') as email,
    nullif(r.extracted_json->>'profile_url', '') as profile_url,
    coalesce(
      (
        select array_agg(value)
        from jsonb_array_elements_text(
          case
            when jsonb_typeof(r.extracted_json->'research_areas') = 'array'
              then r.extracted_json->'research_areas'
            else '[]'::jsonb
          end
        ) as value
      ),
      array[]::text[]
    ) as research_areas,
    s.source_url,
    r.confidence,
    r.verified_at,
    r.updated_at,
    row_number() over (
      partition by
        lower(s.institution_name),
        coalesce(
          nullif(lower(r.extracted_json->>'profile_url'), ''),
          nullif(lower(coalesce(r.extracted_json->>'name', r.extracted_json->>'full_name')), '')
        )
      order by
        coalesce(jsonb_array_length(
          case
            when jsonb_typeof(r.extracted_json->'research_areas') = 'array'
              then r.extracted_json->'research_areas'
            else '[]'::jsonb
          end
        ), 0) desc,
        r.verified_at desc nulls last,
        r.updated_at desc
    ) as duplicate_rank
  from public.intake_extracted_records r
  join public.intake_sources s on s.id = r.source_id
  where r.record_type = 'faculty_member'
    and r.review_status = 'verified'
    and coalesce(r.extracted_json->>'name', r.extracted_json->>'full_name') is not null
)
select
  id,
  record_key,
  institution_name,
  institution_aliases,
  full_name,
  faculty_name,
  department_name,
  role,
  email,
  profile_url,
  research_areas,
  source_url,
  confidence,
  verified_at,
  updated_at
from normalized_records
where duplicate_rank = 1;

create or replace view public.university_faculty_department_summary_public
with (security_invoker = true) as
select
  institution_name,
  faculty_name,
  department_name,
  count(*)::integer as member_count,
  array_remove(array_agg(distinct nullif(role, '')), null) as roles,
  (
    select coalesce(array_agg(area order by area), array[]::text[])
    from (
      select distinct unnest(research_areas) as area
      from public.university_faculty_directory_public inner_directory
      where inner_directory.institution_name = directory.institution_name
        and inner_directory.faculty_name = directory.faculty_name
        and inner_directory.department_name = directory.department_name
      limit 12
    ) areas
  ) as research_areas,
  min(source_url) as source_url,
  max(updated_at) as updated_at
from public.university_faculty_directory_public directory
group by institution_name, faculty_name, department_name;

grant select on public.university_faculty_directory_public to anon, authenticated;
grant select on public.university_faculty_department_summary_public to anon, authenticated;
