import Link from "next/link";

export default function Pagination({ page, pages, makeHref }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="mt-8 flex justify-center gap-2">
      {nums.map((n) => (
        <Link
          key={n}
          href={makeHref(n)}
          className={`grid h-9 w-9 place-items-center rounded-lg border text-sm font-medium ${
            n === page
              ? "border-ink-900 bg-ink-900 text-white"
              : "border-slate-300 bg-white hover:border-gold-500"
          }`}
        >
          {n}
        </Link>
      ))}
    </div>
  );
}
