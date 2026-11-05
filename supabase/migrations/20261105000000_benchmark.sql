create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 24),
  avatar_id text not null default 'badge-1'
    check (avatar_id ~ '^(badge|flat)-[1-6]$'),
  equipped_cosmetics jsonb not null default
    '{"nameColorId":"navy","nameColor":"#202b3a","fontId":"default","font":"Arial, Helvetica, sans-serif","backgroundId":"white","background":"#ffffff","glowId":"none","glow":false}'::jsonb,
  unlocked_cosmetics jsonb not null default
    '{"nameColors":["navy"],"fonts":["default"],"backgrounds":["white"],"glows":["none"]}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  master_volume smallint not null default 70 check (master_volume between 0 and 100),
  effects_enabled boolean not null default true,
  music_enabled boolean not null default false,
  dark_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_levels smallint[] not null default '{}'
    check (completed_levels <@ array[1, 2, 3, 4, 5]::smallint[]),
  updated_at timestamptz not null default now()
);

create table if not exists public.leaderboard_scores (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  points bigint not null default 0 check (points >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_points_idx
  on public.leaderboard_scores (points desc, updated_at asc);

create or replace view public.benchmark_leaderboard
with (security_invoker = true)
as
select
  scores.user_id,
  profiles.username,
  profiles.display_name,
  profiles.avatar_id,
  profiles.equipped_cosmetics,
  scores.points,
  row_number() over (order by scores.points desc, scores.updated_at asc, scores.user_id) as placement
from public.leaderboard_scores as scores
join public.profiles as profiles on profiles.id = scores.user_id;

grant select on public.benchmark_leaderboard to anon, authenticated;

create table if not exists public.timed_challenge_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  answered_questions smallint,
  correct_answers smallint,
  bonus_points smallint,
  points_awarded integer,
  total_points bigint
);

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_progress enable row level security;
alter table public.leaderboard_scores enable row level security;
alter table public.timed_challenge_sessions enable row level security;

grant select on public.profiles, public.leaderboard_scores to anon, authenticated;
grant select on public.user_progress, public.user_settings to authenticated;
grant insert, update on public.user_settings to authenticated;
grant select on public.timed_challenge_sessions to authenticated;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Users read their own settings" on public.user_settings;
create policy "Users read their own settings"
  on public.user_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users create their own settings" on public.user_settings;
create policy "Users create their own settings"
  on public.user_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their own settings" on public.user_settings;
create policy "Users update their own settings"
  on public.user_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users read their own progress" on public.user_progress;
create policy "Users read their own progress"
  on public.user_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Leaderboard scores are publicly readable" on public.leaderboard_scores;
create policy "Leaderboard scores are publicly readable"
  on public.leaderboard_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Users read their own timed sessions" on public.timed_challenge_sessions;
create policy "Users read their own timed sessions"
  on public.timed_challenge_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.create_benchmark_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_username text := lower(new.raw_user_meta_data ->> 'username');
begin
  if new_username is null or new_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'A username containing 3 to 24 letters, numbers, or underscores is required.';
  end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, new_username, new_username);
  insert into public.user_settings (user_id) values (new.id);
  insert into public.user_progress (user_id) values (new.id);
  insert into public.leaderboard_scores (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_benchmark_user_created on auth.users;
create trigger on_benchmark_user_created
  after insert on auth.users
  for each row execute procedure public.create_benchmark_user();

create or replace function public.record_lesson_attempt(
  p_user_id uuid,
  p_lesson_number smallint,
  p_correct_answers smallint
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  completed smallint[];
  awarded_points smallint;
  total_points bigint;
begin
  if p_lesson_number not between 1 and 5 or p_correct_answers not between 0 and 10 then
    raise exception 'Invalid lesson result.';
  end if;

  select completed_levels into completed
  from public.user_progress
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'Player progress was not found.';
  end if;
  if p_lesson_number > 1 and not ((p_lesson_number - 1) = any(completed)) then
    raise exception 'Complete the previous level before playing this one.';
  end if;

  awarded_points := p_correct_answers;
  if p_correct_answers >= 7 and not (p_lesson_number = any(completed)) then
    completed := array_append(completed, p_lesson_number);
    select array_agg(level order by level) into completed from unnest(completed) as level;
  end if;

  update public.user_progress
  set completed_levels = completed, updated_at = now()
  where user_id = p_user_id;

  update public.leaderboard_scores
  set points = points + awarded_points, updated_at = now()
  where user_id = p_user_id
  returning points into total_points;

  return jsonb_build_object(
    'correct_answers', p_correct_answers,
    'points_awarded', awarded_points,
    'total_points', total_points,
    'completed_levels', completed
  );
end;
$$;

create or replace function public.finish_timed_challenge(
  p_user_id uuid,
  p_session_id uuid,
  p_answered_questions smallint,
  p_correct_answers smallint
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  challenge public.timed_challenge_sessions%rowtype;
  bonus smallint;
  awarded_points integer;
  new_total_points bigint;
begin
  select * into challenge
  from public.timed_challenge_sessions
  where id = p_session_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'Timed Challenge session was not found.';
  end if;

  if challenge.completed_at is not null then
    return jsonb_build_object(
      'answered_questions', challenge.answered_questions,
      'correct_answers', challenge.correct_answers,
      'bonus_points', challenge.bonus_points,
      'points_awarded', challenge.points_awarded,
      'total_points', challenge.total_points
    );
  end if;

  if challenge.started_at > now() - interval '60 seconds' then
    raise exception 'The 60-second challenge has not ended yet.';
  end if;
  if p_answered_questions not between 0 and 50
    or p_correct_answers < 0
    or p_correct_answers > p_answered_questions then
    raise exception 'Invalid Timed Challenge answers.';
  end if;

  bonus := case
    when p_correct_answers > 30 then 50
    when p_correct_answers > 20 then 30
    when p_correct_answers > 10 then 15
    else 0
  end;
  awarded_points := p_correct_answers + bonus;

  update public.leaderboard_scores
  set points = points + awarded_points, updated_at = now()
  where user_id = p_user_id
  returning points into new_total_points;

  update public.timed_challenge_sessions
  set completed_at = now(),
      answered_questions = p_answered_questions,
      correct_answers = p_correct_answers,
      bonus_points = bonus,
      points_awarded = awarded_points,
      total_points = new_total_points
  where id = p_session_id;

  return jsonb_build_object(
    'answered_questions', p_answered_questions,
    'correct_answers', p_correct_answers,
    'bonus_points', bonus,
    'points_awarded', awarded_points,
    'total_points', new_total_points
  );
end;
$$;

revoke all on function public.record_lesson_attempt(uuid, smallint, smallint) from public, anon, authenticated;
revoke all on function public.finish_timed_challenge(uuid, uuid, smallint, smallint) from public, anon, authenticated;
grant execute on function public.record_lesson_attempt(uuid, smallint, smallint) to service_role;
grant execute on function public.finish_timed_challenge(uuid, uuid, smallint, smallint) to service_role;

do $$
begin
  if to_regclass('public.leaderboard_entries') is not null then
    execute 'alter table public.leaderboard_entries enable row level security';
    execute 'drop policy if exists "Students can publish leaderboard entries" on public.leaderboard_entries';
    execute 'drop policy if exists "Students can update leaderboard entries" on public.leaderboard_entries';
    execute 'drop policy if exists "Leaderboard entries are readable" on public.leaderboard_entries';
    execute 'revoke all on public.leaderboard_entries from public, anon, authenticated';
  end if;
end;
$$;
