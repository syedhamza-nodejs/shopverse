"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { discountPct } from "@/lib/format";
import Price from "@/components/Price";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, remove } = useWishlist();
  const add = useCart((s) => s.add);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-10">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-6xl text-gold-500">♡</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-ink-700/60">Save your favourite items here for later.</p>
        <Link href="/products" className="mt-6 inline-block rounded-sm bg-gold-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold md:text-3xl">My Wishlist</h1>
      <div className="gold-rule mt-3 mb-6" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => {
          const off = discountPct(p.price, p.compareAtPrice);
          return (
            <div key={p._id} className="flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white">
              <Link href={`/products/${p.slug}`} className="relative aspect-square bg-cream">
                <Image src={p.image || "https://picsum.photos/seed/x/400"} alt={p.name} fill sizes="25vw" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <Link href={`/products/${p.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-gold-600">{p.name}</Link>
                <div className="mt-1 flex items-baseline gap-2">
                  <Price amount={p.price} className="font-display font-bold" />
                  {off > 0 && <Price amount={p.compareAtPrice} className="text-xs text-ink-700/40 line-through" />}
                </div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button onClick={() => { add(p); remove(p._id); }} className="flex-1 rounded-sm bg-ink-900 py-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:bg-gold-500 hover:text-ink-900">
                    Add to Cart
                  </button>
                  <button onClick={() => remove(p._id)} className="rounded-sm border border-ink-100 px-3 text-ink-700/60 hover:text-red-500">✕</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
