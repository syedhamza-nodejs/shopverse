import { Suspense } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";
import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: name };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const qs = new URLSearchParams();
  qs.set("category", slug);
  if (sp.sort) qs.set("sort", sp.sort);
  if (sp.page) qs.set("page", sp.page);
  if (sp.brand) qs.set("brand", sp.brand);
  if (sp.min) qs.set("min", sp.min);
  if (sp.max) qs.set("max", sp.max);
  qs.set("limit", "12");

  let data = { products: [], page: 1, pages: 1, total: 0 };
  let cat = null;
  try {
    const [d, cats] = await Promise.all([getProducts(`?${qs.toString()}`), getCategories()]);
    data = d;
    cat = cats.find((c) => c.slug === slug);
  } catch {}

  const makeHref = (n) => {
    const x = new URLSearchParams(qs.toString());
    x.set("page", n);
    return `/category/${slug}?${x.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-3 text-sm text-ink-700/50">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/products" className="hover:text-gold-600">Products</Link>
        <span className="mx-1">/</span>
        <span className="text-ink-800">{cat?.name || slug}</span>
      </nav>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">{cat?.name || slug}</h1>
        <Link href="/" className="rounded-sm border border-ink-100 px-4 py-2 text-sm font-medium hover:border-gold-500 hover:text-gold-600">
          ← Back to Home
        </Link>
      </div>
      {cat?.description && <p className="mb-6 text-ink-700/55">{cat.description}</p>}

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <Suspense>
          <Filters category={slug} />
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
