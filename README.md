# Benchmark

Benchmark is a static Computer System Servicing learning site built with HTML, CSS, and JavaScript. Supabase Auth stores player profiles and preferences; an Edge Function verifies quiz answers and awards leaderboard points.

## Local setup

Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the deployment environment. The build script injects those public client values into the generated site; do not put a service-role key in the browser or commit secrets.

```powershell
npm run build
```

## Supabase setup

1. Apply `supabase/migrations/20261105000000_benchmark.sql` in the Supabase SQL Editor, or apply the migration with the Supabase CLI.
2. Deploy the `benchmark-game` Edge Function:

   ```powershell
   supabase functions deploy benchmark-game
   ```

3. Configure the function's `SUPABASE_SERVICE_ROLE_KEY` secret in Supabase if the project does not already expose it to Edge Functions. Keep this key server-side.
4. In Supabase Auth settings, disable email confirmation. The sign-in form accepts only a username and password and internally maps the trimmed, lowercase username to a non-deliverable `@benchmark.app` Auth address.
5. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` to the static site's build environment. The publishable/anon key is intended for browser use; Row Level Security protects user-owned settings and server-only score writes.

`supabase/config.toml` also disables email confirmation for local Supabase development. Hosted projects must have the equivalent Auth setting disabled.

## Player features

- Train mode reuses the lesson summaries, questions, answers, explanations, and matching pairs in `app.js`; it never awards points.
- Timed Challenge lasts 60 seconds. The Edge Function grades submitted answers, assigns the answer points plus only the highest reached bonus tier, and stores the result.
- Cosmetic unlock thresholds and available styles are configured in `supabase/functions/_shared/cosmetics.ts`.
- Avatar artwork stays in the two original 3-by-2 transparent sprite sheets under `assets/avatars`; CSS positions each avatar inside a circular frame.
- `assets/sounds/` contains the four sound effects and the looping `Music.mp3` background track. Background music is independently controlled in Settings, plays at 40% of Master volume, and starts after the player's first interaction.

The previous anonymous `leaderboard_entries` table is made inaccessible to browser roles by the migration. Its rows are retained privately; new public scores come from the RLS-protected `benchmark_leaderboard` view.
