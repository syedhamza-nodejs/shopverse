"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export default function AddToCart({ product }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const out = product.countInStock === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-sm border border-ink-100">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-lg">−</button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))} className="px-4 py-3 text-lg">+</button>
      </div>

      <button
        onClick={() => add(product, qty)}
        disabled={out}
        className="rounded-sm bg-gold-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 transition hover:bg-gold-400 disabled:bg-ink-100 disabled:text-ink-700/40"
      >
        {out ? "Out of Stock" : "Add to Cart"}
      </button>
      <button
        onClick={() => { add(product, qty); router.push("/cart"); }}
        disabled={out}
        className="rounded-sm border-2 border-ink-900 px-8 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 transition hover:bg-ink-900 hover:text-gold-400 disabled:border-ink-100 disabled:text-ink-700/40"
      >
        Buy Now
      </button>
    </div>
  );
}
