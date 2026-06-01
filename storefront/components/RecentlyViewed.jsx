"use client";
import { useEffect, useState } from "react";
import { useRecent } from "@/store/recent";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentId }) {
  const [mounted, setMounted] = useState(false);
  const items = useRecent((s) => s.items);
  useEffect(() => setMounted(true), []);

  const list = (mounted ? items : []).filter((p) => p._id !== currentId).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="mt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">Continue Browsing</p>
      <h2 className="mt-1 font-display text-2xl font-bold text-ink-900">Recently Viewed</h2>
      <div className="gold-rule mt-3 mb-6" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p._id} product={{ ...p, countInStock: p.countInStock ?? 10 }} />
        ))}
      </div>
    </section>
  );
}
