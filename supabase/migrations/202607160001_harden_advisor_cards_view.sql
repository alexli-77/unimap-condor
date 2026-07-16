-- Harden the university_advisor_cards view so it runs with the querying user's
-- privileges (RLS on the underlying faculty_* tables is enforced) instead of the
-- view owner's. Mirrors the security_invoker treatment already applied to the
-- public faculty / decision-fact views (see 202606110002, 202606120001).
-- Column list is kept byte-for-byte identical to 202605270001 so downstream
-- mappers (mapAdvisorRow) stay unchanged.
create or replace view public.university_advisor_cards
with (security_invoker = true) as
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

grant select on public.university_advisor_cards to anon, authenticated;
