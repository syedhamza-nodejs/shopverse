"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { discountPct } from "@/lib/format";
import Price from "@/components/Price";

function useCountdown() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end - now);
      setT({
        h: Math.floor(diff / 3.6e6),
        m: Math.floor((diff % 3.6e6) / 6e4),
        s: Math.floor((diff % 6e4) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const Box = ({ v, l }) => (
  <div className="text-center">
    <div className="grid h-12 w-12 place-items-center rounded-md bg-ink-900 font-display text-xl font-bold text-gold-400">
      {String(v).padStart(2, "0")}
    </div>
    <span className="mt-1 block text-[10px] uppercase tracking-wider text-ink-700/50">{l}</span>
  </div>
);

export default function DealOfDay({ product }) {
  const { h, m, s } = useCountdown();
  if (!product) return null;
  const off = discountPct(product.price, product.compareAtPrice);

  return (
    <section className="mt-16 overflow-hidden rounded-2xl border border-gold-400/40 bg-cream">
      <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">⚡ Deal of the Day</p>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">{product.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-ink-700/60">{product.description}</p>
          <div className="mt-4 flex items-baseline gap-3">
            <Price amount={product.price} className="font-display text-3xl font-bold text-ink-900" />
            {off > 0 && (
              <>
                <Price amount={product.compareAtPrice} className="text-ink-700/40 line-through" />
                <span className="rounded-sm bg-ink-900 px-2 py-1 text-xs font-bold text-gold-400">-{off}%</span>
              </>
            )}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Box v={h} l="Hrs" /><span className="font-bold text-ink-700/40">:</span>
            <Box v={m} l="Min" /><span className="font-bold text-ink-700/40">:</span>
            <Box v={s} l="Sec" />
          </div>
          <Link href={`/products/${product.slug}`} className="mt-6 inline-block rounded-sm bg-gold-500 px-7 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400">
            Grab the Deal →
          </Link>
        </div>
        <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={product.images?.[0] || "https://picsum.photos/seed/x/600"} alt={product.name} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover transition duration-500 hover:scale-105" />
        </Link>
      </div>
    </section>
  );
}
