create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  question_id text not null check (question_id ~ '^l[0-4]q[0-9]$'),
  wrong_attempts smallint not null default 0 check (wrong_attempts between 0 and 2),
  correct_matches jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 minutes',
  completed_at timestamptz
);

create table if not exists public.lesson_attempt_sessions (
  id uuid primary key default gen_random_uuid(),
  lesson_number smallint not null check (lesson_number between 1 and 5),
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 minutes',
  completed_at timestamptz
);

alter table public.timed_challenge_sessions
  add column if not exists submitted_answers jsonb not null default '{}'::jsonb;

alter table public.training_sessions enable row level security;
alter table public.lesson_attempt_sessions enable row level security;
revoke all on public.training_sessions from public, anon, authenticated;
revoke all on public.lesson_attempt_sessions from public, anon, authenticated;
grant all on public.training_sessions to service_role;
grant all on public.lesson_attempt_sessions to service_role;

create or replace function public.record_training_mistake(
  p_session_id uuid,
  p_question_id text
)
returns smallint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  attempts smallint;
begin
  update public.training_sessions
  set wrong_attempts = least(wrong_attempts + 1, 2)
  where id = p_session_id
    and question_id = p_question_id
    and completed_at is null
    and expires_at > now()
  returning wrong_attempts into attempts;

  if not found then
    raise exception 'Training question was not found or has expired.';
  end if;

  return attempts;
end;
$$;

revoke all on function public.record_training_mistake(uuid, text) from public, anon, authenticated;
grant execute on function public.record_training_mistake(uuid, text) to service_role;
