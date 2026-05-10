export function SetupCard() {
  return (
    <section className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-8 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">Setup needed</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Connect your Supabase project</h2>
      <div className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
        <p>
          Copy <code className="rounded bg-black/20 px-2 py-1">.env.example</code> to{" "}
          <code className="rounded bg-black/20 px-2 py-1">.env.local</code> and add your project
          URL, anon key, local app URL, and owner email.
        </p>
        <p>
          Then create or link a Supabase project and run the SQL migration in{" "}
          <code className="rounded bg-black/20 px-2 py-1">
            supabase/migrations/20260510052000_init_movie_log.sql
          </code>
          .
        </p>
        <p>
          Set up your owner account in Supabase Auth before signing in, because public visitors only
          get read-only access.
        </p>
      </div>
    </section>
  );
}
