"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { v: "newest", label: "Newest" },
  { v: "priceAsc", label: "Price: Low to High" },
  { v: "priceDesc", label: "Price: High to Low" },
  { v: "rating", label: "Top Rated" },
];

export default function SortBar({ total }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") || "newest";

  const onChange = (e) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("sort", e.target.value);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">{total} products</p>
      <select
        value={current}
        onChange={onChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-gold-500"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
