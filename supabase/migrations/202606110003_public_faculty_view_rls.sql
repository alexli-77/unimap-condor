grant select (
  id,
  record_key,
  source_id,
  record_type,
  extracted_json,
  confidence,
  review_status,
  verified_at,
  updated_at
) on public.intake_extracted_records to anon, authenticated;

grant select (
  id,
  institution_name,
  source_url
) on public.intake_sources to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_extracted_records'
      and policyname = 'Public can read verified faculty records'
  ) then
    create policy "Public can read verified faculty records"
      on public.intake_extracted_records
      for select
      to anon, authenticated
      using (
        record_type = 'faculty_member'
        and review_status = 'verified'
        and coalesce(extracted_json->>'name', extracted_json->>'full_name') is not null
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
      and policyname = 'Public can read sources with verified faculty records'
  ) then
    create policy "Public can read sources with verified faculty records"
      on public.intake_sources
      for select
      to anon, authenticated
      using (
        exists (
          select 1
          from public.intake_extracted_records records
          where records.source_id = intake_sources.id
            and records.record_type = 'faculty_member'
            and records.review_status = 'verified'
            and coalesce(records.extracted_json->>'name', records.extracted_json->>'full_name') is not null
        )
      );
  end if;
end
$$;
