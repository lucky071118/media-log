export function SetupCard() {
  return (
    <section className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-8 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">System status</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">System unavailable</h2>
      <div className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
        <p>The site is temporarily unavailable.</p>
        <p>Please try again later.</p>
      </div>
    </section>
  );
}
