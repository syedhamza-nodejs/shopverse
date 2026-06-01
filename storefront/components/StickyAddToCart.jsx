"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/store/cart";
import Price from "@/components/Price";

// Mobile sticky bar — appears after scrolling past the main buy area.
export default function StickyAddToCart({ product }) {
  const add = useCart((s) => s.add);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const out = product.countInStock === 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 backdrop-blur transition-transform md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Image src={product.images?.[0] || "https://picsum.photos/seed/x/100"} alt={product.name} width={44} height={44} className="rounded object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{product.name}</p>
          <Price amount={product.price} className="text-sm font-bold text-ink-900" />
        </div>
        <button onClick={() => add(product)} disabled={out}
          className="rounded-sm bg-ink-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-400 disabled:bg-ink-100 disabled:text-ink-700/40">
          {out ? "Sold Out" : "Add"}
        </button>
      </div>
    </div>
  );
}
