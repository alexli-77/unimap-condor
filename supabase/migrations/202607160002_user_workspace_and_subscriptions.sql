-- LEO-196: per-user workspace cloud sync + Lemon Squeezy subscriptions.
--
-- Design notes:
--   * The three workspace tables store one row per logical item (favorite id /
--     university id / user) with a `payload jsonb` mirror of the client shape.
--     Row-per-item keeps the union merge on first login trivial (upsert by key,
--     compare `updated_at`) without needing to diff nested arrays.
--   * RLS is owner-scoped (auth.uid() = user_id) for full CRUD on the workspace
--     tables. `subscriptions` is user-readable only; every write path goes through
--     the service_role (which bypasses RLS) from the Lemon Squeezy webhook.
--   * Grants are column-free table grants to `authenticated` only — anon has no
--     business touching per-user rows. RLS still gates row visibility on top.

create extension if not exists pgcrypto;

-- Saved favorites (schools / subjects / advisors). `favorite_id` is the client
-- FavoriteItem.id, so a union merge is a plain upsert keyed by (user_id, id).
create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  favorite_id text not null,
  payload jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, favorite_id)
);

-- Per-school application decision workflow, keyed by university id.
create table if not exists public.user_school_decisions (
  user_id uuid not null references auth.users (id) on delete cascade,
  university_id bigint not null,
  payload jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, university_id)
);

-- Single preference profile per user (one row).
create table if not exists public.user_preference_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Lemon Squeezy subscription mirror. One row per user (their current plan);
-- `ls_subscription_id` is unique so the webhook can also reconcile by LS id.
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  ls_subscription_id text unique,
  status text not null default 'inactive',
  plan text,
  current_period_end timestamptz,
  raw jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_favorites_user_idx
  on public.user_favorites (user_id);
create index if not exists user_school_decisions_user_idx
  on public.user_school_decisions (user_id);

alter table public.user_favorites enable row level security;
alter table public.user_school_decisions enable row level security;
alter table public.user_preference_profiles enable row level security;
alter table public.subscriptions enable row level security;

-- Owner-scoped full-CRUD policies for the workspace tables, plus a read-only
-- policy on subscriptions. Guarded so the migration is idempotent.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_favorites'
      and policyname = 'user_favorites_owner_rw'
  ) then
    create policy user_favorites_owner_rw
      on public.user_favorites for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_school_decisions'
      and policyname = 'user_school_decisions_owner_rw'
  ) then
    create policy user_school_decisions_owner_rw
      on public.user_school_decisions for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preference_profiles'
      and policyname = 'user_preference_profiles_owner_rw'
  ) then
    create policy user_preference_profiles_owner_rw
      on public.user_preference_profiles for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  -- Subscriptions: users may read their own row only. No insert/update/delete
  -- policy exists, so only the service_role (RLS-exempt) webhook can write.
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'subscriptions'
      and policyname = 'subscriptions_owner_read'
  ) then
    create policy subscriptions_owner_read
      on public.subscriptions for select
      using (auth.uid() = user_id);
  end if;
end $$;

grant select, insert, update, delete on public.user_favorites to authenticated;
grant select, insert, update, delete on public.user_school_decisions to authenticated;
grant select, insert, update, delete on public.user_preference_profiles to authenticated;
grant select on public.subscriptions to authenticated;
