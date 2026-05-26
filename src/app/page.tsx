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
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <Hero />
        <main className="mt-10">
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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
      <Hero />

      <main className="mt-10 space-y-8">
        <section className="grid gap-4">
          <MetricCard label="Entries logged" value={String(entries.length)} />
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Watch history
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">My public media log</h2>
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
    <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
          Personal media diary
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          A personal log of films, shows, and everything in between.
        </h1>
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
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
          : "border-red-300/30 bg-red-300/10 text-red-100"
      }`}
    >
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 break-words text-2xl font-semibold text-white">{value}</p>
    </section>
  );
}
