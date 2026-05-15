import { MediaEntryForm } from "@/components/media-entry-form";
import { MediaList } from "@/components/media-list";
import { SetupCard } from "@/components/setup-card";
import { hasOwnerEmail, hasSupabaseEnv, isSiteOwnerEmail } from "@/lib/env";
import { type MediaEntry } from "@/lib/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createMediaEntry, deleteMediaEntry, signOut } from "./actions";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const error = getSearchParam(params.error);
  const message = getSearchParam(params.message);

  if (!hasSupabaseEnv() || !hasOwnerEmail()) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <Hero />
        <main className="mt-10">
          <SetupCard />
        </main>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = isSiteOwnerEmail(user?.email);

  let entries: MediaEntry[] = [];
  let entriesError2: string | null = null;

  const { data, error: entriesError } = await supabase
    .from("media_entries")
    .select("id, title, release_year, watched_on, rating, review, created_at")
    .order("watched_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (entriesError) {
    entriesError2 = entriesError.message;
  } else {
    entries = data satisfies MediaEntry[];
  }

  const ratedEntries = entries.filter((entry) => entry.rating !== null);
  const averageRating =
    ratedEntries.length > 0
      ? (
          ratedEntries.reduce((total, entry) => total + (entry.rating ?? 0), 0) /
          ratedEntries.length
        ).toFixed(1)
      : "—";
  const lastWatched = entries[0]?.watched_on ? formatDate(entries[0].watched_on) : "Nothing yet";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
      <Hero />

      <main className="mt-10 space-y-8">
        {message ? (
          <Banner tone="success">{message}</Banner>
        ) : error ? (
          <Banner tone="error">{error}</Banner>
        ) : null}

        {!user ? (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Entries logged" value={String(entries.length)} />
              <MetricCard label="Average rating" value={averageRating} />
              <MetricCard label="Last watched" value={lastWatched} />
              <MetricCard label="Access" value="Public archive" />
            </section>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Watch history
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  My personal Letterboxd
                </h2>
              </div>

              {entriesError2 ? <Banner tone="error">{entriesError2}</Banner> : null}
              <MediaList deleteAction={deleteMediaEntry} isOwner={false} entries={entries} />
            </div>
          </>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <MetricCard label="Viewing as" value={user.email ?? "Unknown user"} />
              <MetricCard label="Entries logged" value={String(entries.length)} />
              <MetricCard label="Average rating" value={averageRating} />
              <MetricCard label="Last watched" value={lastWatched} />
            </section>

            {isOwner ? (
              <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
                <div className="space-y-6">
                  <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                          Owner dashboard
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          Add an entry, give it a score from 0 to 5 stars, and write a short review.
                        </p>
                      </div>
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-cyan-300 hover:text-white"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  </section>

                  <MediaEntryForm action={createMediaEntry} />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                      Watch history
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Your public media log</h2>
                  </div>

                  {entriesError2 ? <Banner tone="error">{entriesError2}</Banner> : null}
                  <MediaList deleteAction={deleteMediaEntry} isOwner={true} entries={entries} />
                </div>
              </div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                      Watch history
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">My personal Letterboxd</h2>
                  </div>

                  {entriesError2 ? <Banner tone="error">{entriesError2}</Banner> : null}
                  <MediaList deleteAction={deleteMediaEntry} isOwner={false} entries={entries} />
                </div>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                        Read-only session
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Visitor access only</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        This account is not the owner account, so the media log stays public but
                        read-only.
                      </p>
                    </div>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-cyan-300 hover:text-white"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Hero() {
  return (
    <header className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
          Personal media diary
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Build your own public Letterboxd-style media log.
        </h1>
        <p className="max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
          Visitors can browse every film you have watched, while only your owner account can score
          titles, write quick reviews, and manage the archive through Supabase.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          "Public watch log with owner-only editing",
          "0 to 5 star scoring and short review comments",
          "Supabase migrations, storage, and Vercel-ready deployment",
        ].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200"
          >
            {item}
          </div>
        ))}
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
