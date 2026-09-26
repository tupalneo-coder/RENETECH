-- Run this script in the Supabase SQL Editor for the project used by app.js.
-- Public client writes are suitable for a classroom demo, not an anti-cheat leaderboard.

create table if not exists public.leaderboard_entries (
  player_id uuid primary key,
  last_name text not null check (char_length(btrim(last_name)) between 1 and 24),
  points bigint not null default 0 check (points >= 0),
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_entries enable row level security;

grant select, insert, update on public.leaderboard_entries to anon, authenticated;

drop policy if exists "Leaderboard entries are readable" on public.leaderboard_entries;
create policy "Leaderboard entries are readable"
  on public.leaderboard_entries for select
  to anon, authenticated
  using (true);

drop policy if exists "Students can publish leaderboard entries" on public.leaderboard_entries;
create policy "Students can publish leaderboard entries"
  on public.leaderboard_entries for insert
  to anon, authenticated
  with check (
    char_length(btrim(last_name)) between 1 and 24
    and points >= 0
  );

drop policy if exists "Students can update leaderboard entries" on public.leaderboard_entries;
create policy "Students can update leaderboard entries"
  on public.leaderboard_entries for update
  to anon, authenticated
  using (true)
  with check (
    char_length(btrim(last_name)) between 1 and 24
    and points >= 0
  );