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

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Required

Before the site is fully usable, you still need to:

1. Create a Supabase project.
2. Set the environment variables in `.env.local` and later in Vercel.
3. Run the migrations against your Supabase database.
4. Add rows to `media_entries` in the Supabase dashboard.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Check that the Supabase CLI is available:

```bash
npx supabase --help
```

3. Start local Supabase services:

```bash
npx supabase start
```

4. Apply the migration locally:

```bash
npx supabase db reset
```

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Access model

- Anyone can read the media log.
- The app does not include any in-app create, update, or delete workflow.
- Add or edit rows directly in Supabase Dashboard or with SQL.

## Working with migrations

Create a new migration:

```bash
npx supabase migration new add_some_change
```

Apply pending migrations to your linked remote project:

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Bring dashboard-side changes back into version control:

```bash
npx supabase db pull
```

## Supabase setup notes

- The initial migration creates:
  - `public.media_entries`
  - public read access for the media log
- The app uses the anon key only to read published entries.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add the same environment variables from `.env.local` in Vercel.
4. Link the repo to your production Supabase project and run:

```bash
npx supabase db push
```

5. Redeploy on Vercel after the environment variables and schema are in place.

## Project structure

```text
src/app/                    Next.js routes
src/components/             UI components
src/lib/                    Supabase and media helpers
supabase/migrations/        SQL schema changes
supabase/config.toml        Local Supabase CLI configuration
```
