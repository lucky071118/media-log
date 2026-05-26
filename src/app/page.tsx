import { MediaList } from "@/components/media-list";
import { SetupCard } from "@/components/setup-card";
import { hasSupabaseEnv } from "@/lib/env";
import { normalizeMediaEntries, type MediaEntry } from "@/lib/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!hasSupabaseEnv()) {
    console.error("Missing required environment variables for the deployed media log.");

    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_25%_0%,rgba(34,211,238,0.2),transparent_48%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.2),transparent_45%)]" />
        <Hero />
        <main className="mt-12">
          <SetupCard />
        </main>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();

  let entries: MediaEntry[] = [];
  let entriesError: string | null = null;

  const { data, error } = await supabase
    .from("media_entries")
    .select("id, title, release_year, watched_on, rating, review, created_at")
    .order("watched_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load media entries.", error);
    entriesError = "System unavailable. Please try again later.";
  } else {
    entries = normalizeMediaEntries(data);
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.2),transparent_48%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.25),transparent_45%)]" />
      <Hero />

      <main className="mt-12">
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">
              Watch history
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Curated moments from screen to memory
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              A stylish stream of recent watches, ratings, and reflections.
            </p>
          </div>

          {entriesError ? <Banner tone="error">{entriesError}</Banner> : null}
          <MediaList entries={entries} />
        </section>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="relative space-y-5">
        <p className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
          Personal media diary
        </p>
        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
          A cinematic journal with a modern editorial vibe.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
          Discover every title with clean visuals, soft contrast, and expressive ratings that feel as
          curated as the stories themselves.
        </p>
      </div>
    </header>
  );
}

function Banner({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm backdrop-blur ${
        tone === "success"
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-lg shadow-emerald-950/30"
          : "border-red-300/30 bg-red-300/10 text-red-100 shadow-lg shadow-red-950/25"
      }`}
    >
      {children}
    </div>
  );
}
