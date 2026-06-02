-- =============================================================
-- Habit AI — Supabase / PostgreSQL 17 Schema
-- Jalankan di SQL Editor Supabase project Anda
-- =============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- =============================================================
-- USERS (profile — auth user_id berasal dari auth.users)
-- =============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  ai_name text default 'Luna',
  goal_category text,
  notification_time_morning time default '07:00',
  notification_time_evening time default '21:00',
  ai_notifications_enabled boolean default true,
  push_subscription jsonb,
  onboarding_completed boolean default false,
  created_at timestamptz default now()
);

-- =============================================================
-- GOALS
-- =============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  milestones jsonb default '[]'::jsonb,
  is_active boolean default true,
  target_date date,
  created_at timestamptz default now()
);
create index if not exists goals_user_idx on public.goals(user_id);

-- =============================================================
-- HABITS
-- =============================================================
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  icon text default '✨',
  target text,
  goal_id uuid references public.goals(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists habits_user_idx on public.habits(user_id, is_active);

-- =============================================================
-- HABIT LOGS
-- =============================================================
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  completed boolean default false,
  note text,
  created_at timestamptz default now(),
  unique (habit_id, date)
);
create index if not exists habit_logs_user_date_idx on public.habit_logs(user_id, date desc);

-- =============================================================
-- CHECKINS
-- =============================================================
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  mood text,
  energy text,
  sleep_quality text,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  unique (user_id, date)
);
create index if not exists checkins_user_date_idx on public.checkins(user_id, date desc);

-- =============================================================
-- AI MEMORY
-- =============================================================
create table if not exists public.ai_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null check (category in ('personal','pattern','moment','preference')),
  content text not null,
  source text check (source in ('checkin','reflection','onboarding')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists ai_memory_user_idx on public.ai_memory(user_id, category);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
alter table public.users      enable row level security;
alter table public.goals      enable row level security;
alter table public.habits     enable row level security;
alter table public.habit_logs enable row level security;
alter table public.checkins   enable row level security;
alter table public.ai_memory  enable row level security;

-- Policies: setiap pengguna hanya akses data sendiri
do $$ begin
  create policy "users self" on public.users for all
    using (auth.uid() = id) with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "goals owner" on public.goals for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "habits owner" on public.habits for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "habit_logs owner" on public.habit_logs for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "checkins owner" on public.checkins for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "ai_memory owner" on public.ai_memory for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- =============================================================
-- TRIGGER: auto-create profile saat auth user dibuat
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
