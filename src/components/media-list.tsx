import { type MediaEntry } from "@/lib/media";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

function renderRating(rating: number | null) {
  if (rating === null) {
    return "Unrated";
  }

  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)} · ${rating}/5`;
}

export function MediaList({ entries }: { entries: MediaEntry[] }) {
  if (entries.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-sm text-slate-300 backdrop-blur">
        <p className="font-medium text-white">Your log is waiting for its first feature entry.</p>
        <p className="mt-3 leading-7 text-slate-300">
          Add your first row in Supabase to begin shaping your watch history.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {entries.map((entry) => {
        return (
          <article
            key={entry.id}
            className="group overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/35"
          >
            <div className="h-1.5 w-full bg-[linear-gradient(90deg,rgba(34,211,238,0.7),rgba(167,139,250,0.8),rgba(244,114,182,0.75))]" />
            <div className="p-6 md:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">{entry.title}</h3>
                    {entry.release_year ? (
                      <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                        {entry.release_year}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-300">Watched on {formatDate(entry.watched_on)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-cyan-300/35 bg-cyan-400/15 px-3 py-1 font-medium text-cyan-100">
                  {renderRating(entry.rating)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                  Added {formatDate(entry.created_at)}
                </span>
              </div>

              {entry.review ? (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-100/95">
                  {entry.review}
                </p>
              ) : (
                <p className="mt-5 text-sm italic text-slate-400">No review yet.</p>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
