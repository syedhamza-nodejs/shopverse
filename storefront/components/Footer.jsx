"use client";
import Link from "next/link";
import { useSettings } from "@/store/settings";

export default function Footer() {
  const data = useSettings((s) => s.data);
  return (
    <footer className="mt-20 bg-ink-900 text-ink-100">
      {/* newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Join the Al-Tabarukat Family</h3>
            <p className="mt-1 text-sm text-ink-100/60">New arrivals, special tabarukat & offers — straight to your inbox.</p>
          </div>
          <form className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-l-sm bg-white/10 px-4 py-3 text-sm text-white placeholder:text-ink-100/40 outline-none"
            />
            <button className="rounded-r-sm bg-gold-500 px-6 text-sm font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold">
            <span className="text-gold-gradient">Al-Tabarukat</span>
          </div>
          <p className="mt-3 text-sm text-ink-100/60">
            Authentic tabarukat, banners, aqeeq & Islamic gifts — sourced with reverence from the holy shrines, delivered worldwide.
          </p>
          <div className="mt-4 flex gap-3 text-lg">
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-ink-900">f</a>
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-ink-900">◎</a>
            <a href="https://wa.me/923000000000" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-gold-500 hover:text-ink-900">✆</a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-100/60">
            <li><Link href="/products" className="hover:text-gold-400">All Products</Link></li>
            <li><Link href="/category/tabarukat" className="hover:text-gold-400">Tabarukat</Link></li>
            <li><Link href="/category/banners-alam" className="hover:text-gold-400">Banners & Alam</Link></li>
            <li><Link href="/category/aqeeq-rings" className="hover:text-gold-400">Aqeeq & Rings</Link></li>
            <li><Link href="/category/islamic-books" className="hover:text-gold-400">Islamic Books</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Account</h4>
          <ul className="space-y-2 text-sm text-ink-100/60">
            <li><Link href="/login" className="hover:text-gold-400">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-gold-400">Register</Link></li>
            <li><Link href="/account" className="hover:text-gold-400">My Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-gold-400">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-gold-400">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Customer Care</h4>
          <ul className="space-y-2 text-sm text-ink-100/60">
            <li>📞 {data.phone}</li>
            <li>✉️ {data.email}</li>
            <li>🕐 {data.hours}</li>
            <li className="pt-1 text-gold-400/80">
              <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold-400">
                WhatsApp us to order
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-ink-100/40">
        <p>© {new Date().getFullYear()} ShopVerse · Quality Guaranteed · Worldwide Delivery · After-Sale Service</p>
        <p className="mt-2 text-ink-100/70">
          Designed &amp; Developed by{" "}
          <span className="font-semibold text-gold-400">Hamza Mehdi</span>
          {" · "}
          <span className="font-semibold text-gold-400">HM Solutions</span>
        </p>
      </div>
    </footer>
  );
}
