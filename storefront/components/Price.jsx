"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/store/settings";

// Renders a price (stored in base currency PKR) in the user's selected currency.
export default function Price({ amount, className = "" }) {
  const [mounted, setMounted] = useState(false);
  const data = useSettings((s) => s.data);
  const currency = useSettings((s) => s.currency);
  useEffect(() => setMounted(true), []);

  // Before mount: render base PKR (matches server render → no hydration mismatch)
  const cur =
    mounted && data.currencies
      ? data.currencies.find((c) => c.code === currency) || data.currencies[0]
      : { code: "PKR", symbol: "Rs", rate: 1 };

  const val = (amount || 0) * (cur.rate || 1);
  const decimals = cur.code === "PKR" ? 0 : 2;
  const formatted = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span className={className}>{cur.symbol} {formatted}</span>;
}
