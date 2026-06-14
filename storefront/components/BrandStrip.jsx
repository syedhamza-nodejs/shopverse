const places = ["KARBALA", "NAJAF", "QOM", "MASHHAD", "IRAN", "IRAQ"];

export default function BrandStrip() {
  return (
    <div className="rounded-xl border border-ink-100 bg-white px-4 py-6">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-700/40">
        Authentic Tabarukat Sourced From
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {places.map((b) => (
          <span key={b} className="font-display text-lg font-bold tracking-widest text-ink-700/30 transition hover:text-gold-600">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
