# Media Log

A personal, public-facing media diary built with **Next.js**, **Supabase**, SQL **migrations**, and **Vercel** deployment in mind.

## Philosophy

**Don't over-design. Keep it simple.**

This is a personal tool for one person. Every decision should favour the simplest solution that works — no abstractions for imagined future requirements, no complexity that doesn't earn its place today.

## What this app does

- Shows **your media log publicly** to visitors
- Reads **media entries directly from Supabase**
- Supports **0 to 5 star scores**
- Supports a **short review/comment** for each media entry

## Stack

- **Frontend:** Next.js 16 App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase Postgres
- **Schema management:** SQL migrations in `supabase/migrations`
- **Deployment:** Vercel

## Environment variables

Set these in your Vercel project:

- `SUPABASE_URL=https://your-project-ref.supabase.co`
- `SUPABASE_ANON_KEY=your-anon-key`
- `NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`

The app prefers the server-only `SUPABASE_*` variables and keeps the `NEXT_PUBLIC_*` names as a backward-compatible fallback.

## Required

Before the site is fully usable, you still need to:

1. Create a Supabase project.
2. Set the environment variables in Vercel.
3. Run the migrations against your Supabase database.
4. Add rows to `media_entries` in the Supabase dashboard.

## Access model

- Anyone can read the media log.
- The app does not include any in-app create, update, or delete workflow.
- Add or edit rows directly in Supabase Dashboard or with SQL.

## Working with migrations

Store schema changes as versioned SQL files in `supabase/migrations/`.

- Add a new timestamped `.sql` file for each schema change.
- Run that SQL against your Supabase project from the Dashboard SQL editor or another SQL client.
- Keep the files in git as the source of truth for schema history.

## Supabase setup notes

- The initial migration creates:
  - `public.media_entries`
  - public read access for the media log
- The app uses the anon key only to read published entries.

## Security hardening

- The app sends restrictive security headers, including CSP, HSTS, clickjacking protection, and a locked-down permissions policy.
- Media rows are validated before rendering so malformed database content does not crash the page.
- Follow-up migrations tighten data checks and restrict anonymous reads to the exact columns the UI needs.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables in Vercel.
4. Apply the SQL files in `supabase/migrations/` to your production Supabase project.
5. Redeploy on Vercel after the environment variables and schema are in place.

## Project structure

```text
src/app/                    Next.js routes
src/components/             UI components
src/lib/                    Supabase and media helpers
supabase/migrations/        SQL schema changes
```
