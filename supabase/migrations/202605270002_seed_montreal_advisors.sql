insert into public.institution_profiles (canonical_name, aliases, country, region, city)
values
  (
    'Polytechnique Montréal',
    array[
      'Polytechnique Montreal',
      'École Polytechnique de Montréal',
      'Ecole Polytechnique de Montreal',
      'Polytechnic School of Montreal'
    ],
    'Canada',
    'Quebec',
    'Montreal'
  ),
  (
    'Université de Montréal',
    array[
      'University of Montreal',
      'University of Montréal',
      'UdeM',
      'Montreal University'
    ],
    'Canada',
    'Quebec',
    'Montreal'
  )
on conflict (canonical_name) do update set
  aliases = excluded.aliases,
  country = excluded.country,
  region = excluded.region,
  city = excluded.city,
  updated_at = now();

with advisor_rows as (
  select *
  from (
    values
      ('foutse-khomh', 'Foutse Khomh', 'Polytechnique Montréal', 'Software Engineering / Mila', 'S', 98, 'Software quality, ML/AI systems reliability, LLM code generation benchmarks, and multi-agent evaluation.', 'LLM code generation QA/testing, robustness of AI software systems.', array['Software quality','AI reliability','LLM code generation','Multi-agent evaluation'], array['Software Engineering','Computer Engineering','Mila-affiliated research'], null, null, 'External safer outreach'),
      ('heng-li', 'Heng Li', 'Polytechnique Montréal', 'Software / Systems', 'S-', 94, 'Software systems performance, reliability, runtime monitoring, and infrastructure quality.', 'AI software reliability, runtime monitoring, infra quality.', array['Software systems','Performance','Reliability','Runtime monitoring'], array['Software Engineering','Computer Engineering'], null, null, 'External safer outreach'),
      ('maxime-lamothe', 'Maxime Lamothe', 'Polytechnique Montréal', 'Software Engineering', 'A+', 91, 'Software engineering, logic programming, computer systems software, and LLM-assisted SE tools.', 'LLM-assisted software engineering tools, program analysis, testing.', array['Software engineering','Logic programming','Program analysis','Testing'], array['Software Engineering'], null, null, 'External safer outreach'),
      ('mohammad-hamdaqa', 'Mohammad Hamdaqa', 'Polytechnique Montréal', 'Software Engineering', 'A+', 90, 'Software development, software engineering, systems, and knowledge representation.', 'Software systems and knowledge representation angle; recruiting signal found.', array['Software development','Systems','Knowledge representation'], array['Software Engineering'], null, 'Recruiting signal found', 'External safer outreach'),
      ('bentley-oakes', 'Bentley Oakes', 'Polytechnique Montréal', 'Software Engineering', 'A', 86, 'Software engineering, AI, simulation, and knowledge representation.', 'AI + simulation + software engineering; recruiting signal found.', array['Software engineering','AI','Simulation','Knowledge representation'], array['Software Engineering'], null, 'Recruiting signal found', 'External safer outreach'),
      ('zohreh-sharafi', 'Zohreh Sharafi', 'Polytechnique Montréal', 'Software Engineering', 'A', 84, 'Software engineering and human factors.', 'Developer experience, human factors, and software engineering evaluation.', array['Software engineering','Human factors','Developer experience'], array['Software Engineering'], null, null, 'External safer outreach'),
      ('ettore-merlo', 'Ettore Merlo', 'Polytechnique Montréal', 'Software / Cybersecurity', 'A-', 80, 'Cybersecurity, AI, and software engineering.', 'Security and AI-assisted software engineering overlap.', array['Cybersecurity','AI','Software engineering'], array['Software Engineering','Computer Engineering'], null, null, 'External safer outreach'),
      ('jinghui-cheng', 'Jinghui Cheng', 'Polytechnique Montréal', 'Software Engineering', 'A-', 79, 'Software engineering, human factors, and information systems design.', 'Human-centered software systems and information systems design.', array['Software engineering','Human factors','Information systems'], array['Software Engineering'], null, null, 'External safer outreach'),
      ('amal-zouaq', 'Amal Zouaq', 'Polytechnique Montréal', 'AI / Knowledge Representation', 'A-', 78, 'AI and knowledge representation.', 'Knowledge representation for AI systems; recruiting signal found.', array['AI','Knowledge representation','Semantic systems'], array['Computer Engineering','AI-related research'], null, 'Recruiting signal found', 'External safer outreach'),
      ('omar-abdul-wahab', 'Omar Abdul Wahab', 'Polytechnique Montréal', 'AI / Cybersecurity', 'B+', 73, 'AI and cybersecurity overlap.', 'AI security, resilient systems, and applied cybersecurity.', array['AI','Cybersecurity','Resilient systems'], array['Computer Engineering'], null, null, 'External safer outreach'),
      ('pierre-yves-lajoie', 'Pierre-Yves Lajoie', 'Polytechnique Montréal', 'Robotics / Distributed Systems', 'B', 68, 'Robotics, distributed systems, and computer systems software.', 'Distributed systems software and robotics infrastructure.', array['Robotics','Distributed systems','Computer systems software'], array['Computer Engineering'], null, null, 'External safer outreach'),
      ('ian-arawjo', 'Ian Arawjo', 'Université de Montréal', 'DIRO / Mila', 'Sensitive', 66, 'Human-AI interaction, dynamic programming languages, AI-assisted programming, and evaluation.', 'AI-assisted programming and human-AI evaluation, but handle relationship context carefully.', array['Human-AI interaction','Programming languages','AI-assisted programming','Evaluation'], array['DIRO','Computer Science','Mila-affiliated research'], 'High', null, 'Sensitive DIRO/UdeM list'),
      ('eugene-syriani', 'Eugene Syriani', 'Université de Montréal', 'DIRO / GEODES', 'Sensitive', 65, 'Model-driven engineering, code generation, agentic digital twins, and LLM prompt optimization.', 'Model-driven engineering and code generation fit.', array['Model-driven engineering','Code generation','Agentic digital twins','Prompt optimization'], array['DIRO','Computer Science'], 'Medium', null, 'Sensitive DIRO/UdeM list'),
      ('michalis-famelis', 'Michalis Famelis', 'Université de Montréal', 'DIRO / GEODES', 'Sensitive', 63, 'Software engineering under uncertainty.', 'Uncertainty-aware software engineering and model-based SE.', array['Software engineering','Uncertainty','Model-based engineering'], array['DIRO','Computer Science'], 'Medium', null, 'Sensitive DIRO/UdeM list'),
      ('houari-sahraoui', 'Houari Sahraoui', 'Université de Montréal', 'DIRO', 'Sensitive', 62, 'Software engineering and AI for software engineering.', 'AI for SE, software maintenance, and research fit framing.', array['Software engineering','AI for SE','Software maintenance'], array['DIRO','Computer Science'], 'Medium', null, 'Sensitive DIRO/UdeM list')
  ) as t(slug, full_name, institution_name, department, priority, priority_score, fit_summary, contact_angle, research_areas, target_programs, political_sensitivity, recruiting_signal, outreach_status)
),
upsert_faculty as (
  insert into public.faculty_profiles (slug, full_name, department, research_areas, notes)
  select slug, full_name, department, research_areas, 'Seeded from local vault advisor scan.'
  from advisor_rows
  on conflict (slug) do update set
    full_name = excluded.full_name,
    department = excluded.department,
    research_areas = excluded.research_areas,
    updated_at = now()
  returning id, slug
),
upsert_affiliation as (
  insert into public.faculty_affiliations (faculty_id, institution_id, department, is_primary)
  select f.id, i.id, r.department, true
  from advisor_rows r
  join upsert_faculty f on f.slug = r.slug
  join public.institution_profiles i on i.canonical_name = r.institution_name
  on conflict (faculty_id, institution_id, department, lab) do nothing
  returning faculty_id
),
upsert_fit as (
  insert into public.faculty_program_fits (
    faculty_id,
    program_name,
    priority,
    priority_score,
    fit_summary,
    contact_angle,
    target_programs,
    political_sensitivity,
    recruiting_signal,
    outreach_status
  )
  select
    f.id,
    r.department,
    r.priority,
    r.priority_score,
    r.fit_summary,
    r.contact_angle,
    r.target_programs,
    r.political_sensitivity,
    r.recruiting_signal,
    r.outreach_status
  from advisor_rows r
  join upsert_faculty f on f.slug = r.slug
  on conflict (faculty_id, program_id, program_name) do update set
    priority = excluded.priority,
    priority_score = excluded.priority_score,
    fit_summary = excluded.fit_summary,
    contact_angle = excluded.contact_angle,
    target_programs = excluded.target_programs,
    political_sensitivity = excluded.political_sensitivity,
    recruiting_signal = excluded.recruiting_signal,
    outreach_status = excluded.outreach_status,
    updated_at = now()
  returning faculty_id
)
insert into public.advisor_sources (faculty_id, source_label, source_path, observed_at)
select
  f.id,
  'Vault advisor scan, 2026-05-25',
  '/Users/files/Desktop/LeonKnowledgeBase/Private-Vault/20_PhD/Advisor-Search/2026-05-25-montreal-advisor-scan.md',
  date '2026-05-25'
from advisor_rows r
join upsert_faculty f on f.slug = r.slug
on conflict (faculty_id, source_label, source_path) do update set
  observed_at = excluded.observed_at;
