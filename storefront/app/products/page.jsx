import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";
import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";

export const metadata = { title: "All Products" };

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  if (sp.keyword) qs.set("keyword", sp.keyword);
  if (sp.sort) qs.set("sort", sp.sort);
  if (sp.page) qs.set("page", sp.page);
  if (sp.brand) qs.set("brand", sp.brand);
  if (sp.min) qs.set("min", sp.min);
  if (sp.max) qs.set("max", sp.max);
  qs.set("limit", "12");

  let data = { products: [], page: 1, pages: 1, total: 0 };
  try {
    data = await getProducts(`?${qs.toString()}`);
  } catch {}

  const makeHref = (n) => {
    const x = new URLSearchParams(qs.toString());
    x.set("page", n);
    return `/products?${x.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-3 text-sm text-ink-700/50">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-800">{sp.keyword ? "Search" : "All Products"}</span>
      </nav>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          {sp.keyword ? `Results for “${sp.keyword}”` : "All Products"}
        </h1>
        <Link href="/" className="rounded-sm border border-ink-100 px-4 py-2 text-sm font-medium hover:border-gold-500 hover:text-gold-600">
          ← Back to Home
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <Suspense>
          <Filters />
        </Suspense>
        <div>
          <Suspense>
            <SortBar total={data.total} />
          </Suspense>
          <ProductGrid products={data.products} />
          <Pagination page={data.page} pages={data.pages} makeHref={makeHref} />
        </div>
      </div>
    </div>
  );
}
