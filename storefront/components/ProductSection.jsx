import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, subtitle, products, viewAllHref }) {
  if (!products?.length) return null;
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          {subtitle && (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{subtitle}</p>
          )}
          <h2 className="mt-1 font-display text-2xl font-bold text-ink-900 md:text-3xl">{title}</h2>
          <div className="gold-rule mt-3" />
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-semibold text-ink-900 underline-offset-4 hover:text-gold-600 hover:underline"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
