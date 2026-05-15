import { type MovieEntry } from "@/lib/movies";

type DeleteMovieAction = (formData: FormData) => Promise<void>;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

function renderRating(rating: number | null) {
  if (rating === null) {
    return "Unrated";
  }

  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)} · ${rating}/5`;
}

export function MovieList({
  deleteAction,
  isOwner,
  movies,
}: {
  deleteAction: DeleteMovieAction;
  isOwner: boolean;
  movies: MovieEntry[];
}) {
  if (movies.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
        Your log is empty. Add your first watched movie to start building a private film history.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {movies.map((movie) => {
        return (
          <article
            key={movie.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
          >
            <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold text-white">{movie.title}</h3>
                      {movie.release_year ? (
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                          {movie.release_year}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-300">Watched {formatDate(movie.watched_on)}</p>
                  </div>

                  {isOwner ? (
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={movie.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 transition hover:border-red-300 hover:text-white"
                      >
                        Delete
                      </button>
                    </form>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 font-medium text-cyan-200">
                    {renderRating(movie.rating)}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                    Added {formatDate(movie.created_at)}
                  </span>
                </div>

                {movie.review ? (
                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    {movie.review}
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
