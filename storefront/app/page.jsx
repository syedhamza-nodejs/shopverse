import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, getBanners } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import PromoStrip from "@/components/PromoStrip";
import ProductSection from "@/components/ProductSection";
import BrandStrip from "@/components/BrandStrip";
import Testimonials from "@/components/Testimonials";
import DealOfDay from "@/components/DealOfDay";
import Reveal from "@/components/Reveal";

export default async function HomePage() {
  let categories = [];
  let newArrivals = [];
  let banners = [];
  let catSections = [];
  let deal = null;

  try {
    [categories, banners] = await Promise.all([getCategories(), getBanners()]);
    const arrivalsData = await getProducts(`?sort=newest&limit=8`);
    newArrivals = arrivalsData.products;

    // Deal of the day = biggest discount among recent products
    const pool = await getProducts(`?limit=40`);
    deal = pool.products
      .filter((p) => p.compareAtPrice > p.price)
      .sort((a, b) => (b.compareAtPrice - b.price) - (a.compareAtPrice - a.price))[0] || null;

    const pick = categories.slice(0, 4);
    catSections = await Promise.all(
      pick.map(async (c) => {
        const d = await getProducts(`?category=${c.slug}&limit=4`);
        return { cat: c, products: d.products };
      })
    );
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Bismillah */}
      <div className="mt-5 text-center">
        <p className="font-display text-xl text-green-800 md:text-2xl" dir="rtl" lang="ar">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <div className="gold-rule mx-auto mt-2" />
      </div>

      <section className="mt-6">
        <HeroCarousel banners={banners} />
      </section>

      <section className="mt-6">
        <PromoStrip />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <Reveal className="mt-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">Browse</p>
            <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">Shop by Category</h2>
            <div className="gold-rule mx-auto mt-3" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">
            {categories.map((c) => (
              <Link key={c._id} href={`/category/${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-ink-100 bg-white p-5 transition hover:border-gold-400 hover:shadow-md hover:-translate-y-1">
                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-ink-100 group-hover:ring-gold-400">
                  <Image src={c.image} alt={c.name} fill sizes="80px" className="object-cover transition group-hover:scale-110" />
                </div>
                <span className="text-center text-xs font-semibold text-ink-800 group-hover:text-gold-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal><ProductSection subtitle="Just In" title="New Arrivals" products={newArrivals} viewAllHref="/products?sort=newest" /></Reveal>

      {deal && <Reveal><DealOfDay product={deal} /></Reveal>}

      <Reveal className="mt-14"><BrandStrip /></Reveal>

      {/* Editorial banner */}
      <Reveal className="mt-14">
        <section className="overflow-hidden rounded-2xl bg-green-900">
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Gifts of Barakah</p>
            <h2 className="max-w-xl font-display text-3xl font-bold text-white md:text-4xl">
              Get <span className="text-gold-gradient">10% Off</span> on orders over Rs 15,000
            </h2>
            <p className="max-w-md text-sm text-ink-100/70">
              Authentic tabarukat &amp; gifts for your loved ones. Free delivery on online payments, worldwide shipping.
            </p>
            <Link href="/products" className="mt-2 rounded-sm bg-gold-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400">
              Shop the Collection
            </Link>
          </div>
        </section>
      </Reveal>

      {catSections.map(({ cat, products }) => (
        <Reveal key={cat._id}>
          <ProductSection subtitle="Collection" title={cat.name} products={products} viewAllHref={`/category/${cat.slug}`} />
        </Reveal>
      ))}

      <Reveal><Testimonials /></Reveal>

      {newArrivals.length === 0 && categories.length === 0 && (
        <div className="my-16 rounded-xl border border-dashed border-ink-100 p-10 text-center text-ink-700/50">
          No products yet. Start the backend and run <code className="rounded bg-ink-50 px-1">npm run seed</code>.
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
