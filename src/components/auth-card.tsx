type SignInAction = (formData: FormData) => Promise<void>;

export function AuthCard({ action }: { action: SignInAction }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Owner access
        </p>
        <h2 className="text-3xl font-semibold text-white">Sign in to manage your log</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          Visitors can read your media log, but only the owner account can add ratings, short
          reviews, or delete entries.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "Public read access for your personal Letterboxd-style log",
          "Owner-only management through Supabase Auth and RLS",
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm">
            {item}
          </div>
        ))}
      </div>

      <form action={action} className="mt-8 flex flex-col gap-4 md:flex-row md:items-end">
        <label className="flex-1 text-sm text-slate-200">
          Owner email
          <input
            required
            type="email"
            name="email"
            placeholder="your-owner@email.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Send owner magic link
        </button>
      </form>
    </section>
  );
}
