type CreateMovieAction = (formData: FormData) => Promise<void>;

export function MovieEntryForm({ action }: { action: CreateMovieAction }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          New entry
        </p>
        <h2 className="text-2xl font-semibold text-white">Log a movie you watched</h2>
      </div>

      <form action={action} className="space-y-5">
        <label className="block text-sm text-slate-200">
          Title
          <input
            required
            name="title"
            type="text"
            maxLength={120}
            placeholder="Perfect Blue"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="block text-sm text-slate-200">
            Release year
            <input
              name="releaseYear"
              type="number"
              min={1888}
              max={2100}
              placeholder="1997"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-200">
            Watched on
            <input
              required
              name="watchedOn"
              type="date"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-200">
            Rating
            <select
              name="rating"
              defaultValue=""
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none focus:border-cyan-400"
            >
              <option value="">Unrated</option>
              <option value="0">0 / 5</option>
              <option value="1">1 / 5</option>
              <option value="2">2 / 5</option>
              <option value="3">3 / 5</option>
              <option value="4">4 / 5</option>
              <option value="5">5 / 5</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-slate-200">
          Short review
          <textarea
            name="review"
            rows={4}
            maxLength={280}
            placeholder="A short reaction, favorite moment, or quick review."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
          <span className="mt-2 block text-xs text-slate-400">Up to 280 characters.</span>
        </label>

        <label className="block text-sm text-slate-200">
          Poster image
          <input
            name="poster"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="mt-2 block w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
          />
          <span className="mt-2 block text-xs text-slate-400">
            JPG, PNG, WEBP, or GIF. Max 5MB.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Save to log
        </button>
      </form>
    </section>
  );
}
