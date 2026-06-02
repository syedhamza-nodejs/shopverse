"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getFilterMeta } from "@/lib/api";

export default function Filters({ category }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [meta, setMeta] = useState({ brands: [], minPrice: 0, maxPrice: 0 });
  const [open, setOpen] = useState(false);

  const selectedBrands = (params.get("brand") || "").split(",").filter(Boolean);
  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");

  useEffect(() => {
    getFilterMeta(category ? `?category=${category}` : "").then(setMeta).catch(() => {});
  }, [category]);

  const update = (next) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  };

  const toggleBrand = (b) => {
    const set = new Set(selectedBrands);
    set.has(b) ? set.delete(b) : set.add(b);
    update({ brand: [...set].join(",") });
  };

  const hasFilters = selectedBrands.length || min || max;

  const Panel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Filters</h3>
        {hasFilters && (
          <button onClick={() => { setMin(""); setMax(""); update({ brand: "", min: "", max: "" }); }} className="text-xs text-gold-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="mb-2 text-sm font-semibold">Price ({meta.minPrice}–{meta.maxPrice})</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)}
            className="w-full rounded-sm border border-ink-100 px-2 py-1.5 text-sm outline-none focus:border-gold-500" />
          <span className="text-ink-700/40">–</span>
          <input type="number" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)}
            className="w-full rounded-sm border border-ink-100 px-2 py-1.5 text-sm outline-none focus:border-gold-500" />
        </div>
        <button onClick={() => update({ min, max })} className="mt-2 w-full rounded-sm bg-gold-500 py-2 text-xs font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400">
          Apply Price
        </button>
      </div>

      {/* Brands */}
      {meta.brands.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Brand</p>
          <div className="max-h-60 space-y-1.5 overflow-auto pr-1">
            {meta.brands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700/80">
                <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="accent-gold-600" />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="mb-4 w-full rounded-sm border border-ink-100 py-2 text-sm font-semibold md:hidden">
        {open ? "Hide Filters ▲" : "Show Filters ▼"}
      </button>
      <aside className={`${open ? "block" : "hidden"} md:block`}>
        <div className="rounded-xl border border-ink-100 bg-white p-5">{Panel}</div>
      </aside>
    </>
  );
}
