"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { discountPct } from "@/lib/format";
import Price from "@/components/Price";

export default function ProductCard({ product }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i._id === product._id));
  const off = discountPct(product.price, product.compareAtPrice);
  const out = product.countInStock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)]">
      {/* badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {off > 0 && (
          <span className="rounded-sm bg-ink-900 px-2 py-1 text-[11px] font-bold tracking-wide text-gold-400">
            -{off}%
          </span>
        )}
        {out && (
          <span className="rounded-sm bg-slate-500 px-2 py-1 text-[11px] font-semibold text-white">
            Sold Out
          </span>
        )}
      </div>

      {/* wishlist */}
      <button
        onClick={() => toggle(product)}
        aria-label="Toggle wishlist"
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border bg-white/90 text-lg backdrop-blur transition ${
          wished ? "border-gold-500 text-gold-500" : "border-ink-100 text-ink-700/50 hover:text-gold-500"
        }`}
      >
        {wished ? "♥" : "♡"}
      </button>

      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream">
        <Image
          src={product.images?.[0] || "https://picsum.photos/seed/x/600"}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-widest text-gold-600">{product.brand}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink-800 hover:text-gold-600"
        >
          {product.name}
        </Link>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-700/55">
            {product.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1 text-xs text-gold-500">
          {"★".repeat(Math.round(product.rating || 0))}
          <span className="text-ink-700/40">({product.numReviews || 0})</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <Price amount={product.price} className="font-display text-lg font-bold text-ink-900" />
            {off > 0 && (
              <Price amount={product.compareAtPrice} className="text-xs text-ink-700/40 line-through" />
            )}
          </div>
          <button
            onClick={() => add(product)}
            disabled={out}
            className="mt-3 w-full rounded-sm border border-ink-900 bg-ink-900 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gold-500 hover:border-gold-500 hover:text-ink-900 disabled:cursor-not-allowed disabled:border-ink-100 disabled:bg-ink-100 disabled:text-ink-700/40"
          >
            {out ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
