"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/store/settings";

export default function CurrencySwitcher() {
  const [mounted, setMounted] = useState(false);
  const data = useSettings((s) => s.data);
  const currency = useSettings((s) => s.currency);
  const setCurrency = useSettings((s) => s.setCurrency);
  useEffect(() => setMounted(true), []);

  const currencies = data.currencies || [{ code: "PKR", symbol: "Rs", rate: 1 }];
  if (!mounted || currencies.length < 2) return null;

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      aria-label="Currency"
      className="cursor-pointer rounded-sm border border-ink-100 bg-white px-2 py-1 text-xs font-semibold outline-none hover:border-gold-500"
    >
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} {c.symbol}
        </option>
      ))}
    </select>
  );
}
