create or replace view public.university_decision_facts_public
with (security_invoker = true) as
select
  r.id,
  r.record_key,
  s.institution_name,
  s.source_url,
  s.page_title,
  r.record_type,
  coalesce(r.extracted_json->>'name', r.extracted_json->>'topic', r.record_key) as title,
  nullif(r.extracted_json->>'degree_level', '') as degree_level,
  nullif(r.extracted_json->>'topic', '') as topic,
  nullif(r.extracted_json->>'department', '') as department,
  nullif(r.extracted_json->>'duration', '') as duration,
  nullif(r.extracted_json->>'program_format', '') as program_format,
  coalesce(
    (
      select array_agg(value)
      from jsonb_array_elements_text(
        case
          when jsonb_typeof(r.extracted_json->'amounts') = 'array'
            then r.extracted_json->'amounts'
          else '[]'::jsonb
        end
      ) as value
    ),
    array[]::text[]
  ) as amounts,
  coalesce(r.extracted_json->>'raw_label', r.raw_text, '') as raw_label,
  coalesce(r.extracted_json->>'evidence_url', s.source_url) as evidence_url,
  r.extracted_json as fact_json,
  r.confidence,
  r.verified_at,
  r.updated_at
from public.intake_extracted_records r
join public.intake_sources s on s.id = r.source_id
where r.record_type in ('program', 'tuition_funding')
  and r.review_status = 'verified';

grant select on public.university_decision_facts_public to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_extracted_records'
      and policyname = 'Public can read verified decision facts'
  ) then
    create policy "Public can read verified decision facts"
      on public.intake_extracted_records
      for select
      to anon, authenticated
      using (
        record_type in ('program', 'tuition_funding')
        and review_status = 'verified'
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_sources'
      and policyname = 'Public can read sources with verified decision facts'
  ) then
    create policy "Public can read sources with verified decision facts"
      on public.intake_sources
      for select
      to anon, authenticated
      using (
        exists (
          select 1
          from public.intake_extracted_records records
          where records.source_id = intake_sources.id
            and records.record_type in ('program', 'tuition_funding')
            and records.review_status = 'verified'
        )
      );
  end if;
end
$$;
