const brands = ["SONY", "GALAXY", "APPLE", "NIKE", "PHILIPS", "ADIDAS", "JBL", "FOSSIL"];

export default function BrandStrip() {
  return (
    <div className="rounded-xl border border-ink-100 bg-white px-4 py-6">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-700/40">
        Trusted Brands We Carry
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {brands.map((b) => (
          <span key={b} className="font-display text-lg font-bold tracking-widest text-ink-700/30 transition hover:text-gold-600">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
