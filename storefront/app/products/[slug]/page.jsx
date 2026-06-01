import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProducts } from "@/lib/api";
import { discountPct } from "@/lib/format";
import Gallery from "@/components/Gallery";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import ProductSection from "@/components/ProductSection";
import Price from "@/components/Price";
import ReviewForm from "@/components/ReviewForm";
import RecentlyViewed from "@/components/RecentlyViewed";
import TrackView from "@/components/TrackView";
import StickyAddToCart from "@/components/StickyAddToCart";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const p = await getProduct(slug);
    return { title: p.name, description: p.description?.slice(0, 150) };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const off = discountPct(product.price, product.compareAtPrice);
  const saved = off > 0 ? product.compareAtPrice - product.price : 0;

  // related products from same category
  let related = [];
  try {
    if (product.category?.slug) {
      const d = await getProducts(`?category=${product.category.slug}&limit=5`);
      related = d.products.filter((x) => x._id !== product._id).slice(0, 4);
    }
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <TrackView product={{ _id: product._id, slug: product.slug, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, images: product.images }} />
      {/* breadcrumb */}
      <nav className="mb-5 text-sm text-ink-700/50">
        <Link href="/" className="hover:text-gold-600">Home</Link> /{" "}
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-gold-600">{product.category.name}</Link> /{" "}
          </>
        )}
        <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <Gallery images={product.images} name={product.name} />

        <div>
          {/* badges */}
          {product.badges?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <span key={b} className="rounded-sm border border-gold-400 bg-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-600">
                  {b}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.2em] text-gold-600">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-ink-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-gold-500">{"★".repeat(Math.round(product.rating || 0))}{"☆".repeat(5 - Math.round(product.rating || 0))}</span>
            <span className="text-ink-700/50">{(product.rating || 0).toFixed(1)} · {product.numReviews || 0} reviews</span>
            {product.sku && <span className="ml-auto text-xs text-ink-700/40">SKU: {product.sku}</span>}
          </div>

          {/* price */}
          <div className="mt-5 flex items-end gap-3">
            <Price amount={product.price} className="font-display text-4xl font-bold text-ink-900" />
            {off > 0 && (
              <>
                <Price amount={product.compareAtPrice} className="pb-1 text-lg text-ink-700/40 line-through" />
                <span className="mb-1 rounded-sm bg-ink-900 px-2 py-1 text-xs font-bold text-gold-400">-{off}%</span>
              </>
            )}
          </div>
          {saved > 0 && (
            <p className="mt-1 text-sm font-medium text-green-700">You save <Price amount={saved} /></p>
          )}

          <p className="mt-3 text-sm font-medium">
            {product.countInStock > 0 ? (
              <span className="text-green-700">● In stock — {product.countInStock} available</span>
            ) : (
              <span className="text-red-500">● Currently out of stock</span>
            )}
          </p>

          {/* highlights */}
          {product.highlights?.length > 0 && (
            <ul className="mt-5 space-y-2">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
                  <span className="mt-0.5 text-gold-600">✓</span> {h}
                </li>
              ))}
            </ul>
          )}

          {/* actions */}
          <div className="mt-7 space-y-3">
            <AddToCart product={product} />
            <WishlistButton product={product} />
          </div>

          {/* trust */}
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-ink-100 pt-5 text-xs text-ink-700/70 sm:grid-cols-4">
            <div>🚚<br />Free shipping over Rs 10k</div>
            <div>↺<br />7-day returns</div>
            <div>🔒<br />Secure checkout</div>
            <div>✦<br />100% authentic</div>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="mt-14 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl font-bold">Description</h2>
          <div className="gold-rule mt-2 mb-4" />
          <p className="leading-relaxed text-ink-700/80">{product.description}</p>
        </div>
        {product.specs?.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold">Specifications</h2>
            <div className="gold-rule mt-2 mb-4" />
            <table className="w-full overflow-hidden rounded-lg border border-ink-100 text-sm">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={i} className={i % 2 ? "bg-ink-50" : "bg-white"}>
                    <td className="px-4 py-2.5 font-medium text-ink-700/70">{s.key}</td>
                    <td className="px-4 py-2.5 text-ink-900">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reviews */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>
        <div className="gold-rule mt-2 mb-4" />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {product.reviews?.length > 0 ? (
              product.reviews.map((r, i) => (
                <div key={i} className="rounded-lg border border-ink-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-gold-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-700/70">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-700/50">No reviews yet — be the first to review this product.</p>
            )}
          </div>
          <ReviewForm productId={product._id} slug={product.slug} />
        </div>
      </section>

      {/* Related */}
      <ProductSection title="You May Also Like" subtitle="Related" products={related} viewAllHref={product.category ? `/category/${product.category.slug}` : "/products"} />

      {/* Recently viewed */}
      <RecentlyViewed currentId={product._id} />

      <StickyAddToCart product={product} />
    </div>
  );
}
