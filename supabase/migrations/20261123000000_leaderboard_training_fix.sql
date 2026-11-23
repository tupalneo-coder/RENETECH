do $$
declare
  missing_user record;
  candidate_username text;
  suffix integer;
begin
  for missing_user in
    select users.id, users.raw_user_meta_data ->> 'username' as username
    from auth.users as users
    left join public.profiles as profiles on profiles.id = users.id
    where profiles.id is null
    order by users.created_at, users.id
  loop
    candidate_username := lower(btrim(missing_user.username));
    if candidate_username is null
      or candidate_username !~ '^[a-z0-9_]{3,24}$'
      or exists (select 1 from public.profiles where username = candidate_username) then
      candidate_username := 'u_' || substr(replace(missing_user.id::text, '-', ''), 1, 22);
    end if;

    suffix := 0;
    while exists (select 1 from public.profiles where username = candidate_username) loop
      suffix := suffix + 1;
      if suffix > 99 then
        raise exception 'Could not create a unique username for existing account %.', missing_user.id;
      end if;
      candidate_username := 'u_' || substr(replace(missing_user.id::text, '-', ''), 1, 20) || lpad(suffix::text, 2, '0');
    end loop;

    insert into public.profiles (id, username, display_name)
    values (missing_user.id, candidate_username, candidate_username)
    on conflict (id) do nothing;
  end loop;
end;
$$;

insert into public.user_settings (user_id)
select profiles.id
from public.profiles as profiles
on conflict (user_id) do nothing;

insert into public.user_progress (user_id)
select profiles.id
from public.profiles as profiles
on conflict (user_id) do nothing;

insert into public.leaderboard_scores (user_id)
select profiles.id
from public.profiles as profiles
on conflict (user_id) do nothing;

create or replace view public.benchmark_leaderboard
with (security_invoker = true)
as
select
  profiles.id as user_id,
  profiles.username,
  profiles.display_name,
  profiles.avatar_id,
  profiles.equipped_cosmetics,
  coalesce(scores.points, 0)::bigint as points,
  row_number() over (
    order by coalesce(scores.points, 0) desc, profiles.id asc
  ) as placement
from public.profiles as profiles
left join public.leaderboard_scores as scores on scores.user_id = profiles.id;

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  question_id text not null check (question_id ~ '^l[0-4]q[0-9]$'),
  correct_matches jsonb not null default '[]'::jsonb,
  user_id uuid references auth.users (id) on delete cascade,
  lesson_index smallint not null check (lesson_index between 1 and 5),
  question_order text[] not null check (cardinality(question_order) = 10),
  current_question smallint not null default 0 check (current_question between 0 and 10),
  wrong_attempts smallint not null default 0 check (wrong_attempts between 0 and 2),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 minutes',
  completed_at timestamptz
);

alter table public.training_sessions
  add column if not exists user_id uuid references auth.users (id) on delete cascade,
  add column if not exists lesson_index smallint,
  add column if not exists question_order text[],
  add column if not exists current_question smallint not null default 0;

alter table public.training_sessions enable row level security;
revoke all on public.training_sessions from public, anon, authenticated;
grant all on public.training_sessions to service_role;
