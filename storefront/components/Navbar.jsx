"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuth } from "@/store/auth";
import { useSettings } from "@/store/settings";
import { getCategories } from "@/lib/api";
import Price from "@/components/Price";

export default function Navbar() {
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());
  const wishCount = useWishlist((s) => s.count());
  const { user, logout } = useAuth();
  const logoText = useSettings((s) => s.data.logoText) || "ShopVerse";
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    getCategories().then(setCats).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(`/products?keyword=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main row */}
      <div className="border-b border-ink-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
          <Link href="/" className="font-display text-3xl font-bold tracking-tight">
            {logoText === "ShopVerse" ? (
              <>
                <span className="text-gold-gradient">Shop</span>
                <span className="text-ink-900">Verse</span>
              </>
            ) : (
              <span className="text-gold-gradient">{logoText}</span>
            )}
          </Link>

          <form onSubmit={search} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands and categories…"
              className="w-full rounded-l-full border border-ink-100 bg-ink-50 px-5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
            <button className="rounded-r-full bg-gold-500 px-6 text-sm font-semibold text-ink-900 hover:bg-gold-400">
              Search
            </button>
          </form>

          <nav className="ml-auto flex items-center gap-5 text-sm">
            {mounted && user ? (
              <Link href="/account" className="hidden sm:flex flex-col leading-tight hover:text-gold-600">
                <span className="text-[11px] text-ink-700/60">Hello,</span>
                <span className="font-semibold">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex flex-col leading-tight hover:text-gold-600">
                <span className="text-[11px] text-ink-700/60">Account</span>
                <span className="font-semibold">Sign in</span>
              </Link>
            )}

            <Link href="/wishlist" className="relative hover:text-gold-600">
              <span className="text-xl">♡</span>
              {mounted && wishCount > 0 && (
                <span className="absolute -right-2 -top-1 grid h-4 w-4 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative flex items-center gap-2 hover:text-gold-600">
              <span className="relative text-xl">
                🛍️
                {mounted && count > 0 && (
                  <span className="absolute -right-2 -top-1 grid h-4 w-4 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden lg:flex flex-col leading-tight">
                <span className="text-[11px] text-ink-700/60">Cart</span>
                <span className="font-semibold">{mounted ? <Price amount={subtotal} /> : "Rs 0"}</span>
              </span>
            </Link>

            <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>☰</button>
          </nav>
        </div>
      </div>

      {/* Category nav bar (Islamic green) */}
      <div className="hidden md:block bg-green-900 text-ink-100">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-7 px-4 text-sm font-medium overflow-x-auto no-scrollbar">
          <Link href="/products" className="whitespace-nowrap font-semibold text-gold-400 hover:text-gold-400">
            ▦ All Products
          </Link>
          {cats.map((c) => (
            <Link key={c._id} href={`/category/${c.slug}`} className="whitespace-nowrap hover:text-gold-400">
              {c.name}
            </Link>
          ))}
          <Link href="/products?sort=newest" className="ml-auto whitespace-nowrap text-gold-400/90 hover:text-gold-400">
            ✦ New Arrivals
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white px-4 py-3 space-y-2">
          <form onSubmit={search} className="flex">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
              className="w-full rounded-l-lg border border-ink-100 px-3 py-2 text-sm" />
            <button className="rounded-r-lg bg-ink-900 px-4 text-gold-400 text-sm">Go</button>
          </form>
          <Link href="/products" className="block py-1 font-semibold" onClick={() => setOpen(false)}>All Products</Link>
          {cats.map((c) => (
            <Link key={c._id} href={`/category/${c.slug}`} className="block py-1" onClick={() => setOpen(false)}>{c.name}</Link>
          ))}
          <Link href="/wishlist" className="block py-1" onClick={() => setOpen(false)}>Wishlist</Link>
          {mounted && user ? (
            <button onClick={() => { logout(); setOpen(false); router.push("/"); }} className="block py-1 text-red-600">Logout</button>
          ) : (
            <Link href="/login" className="block py-1" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
