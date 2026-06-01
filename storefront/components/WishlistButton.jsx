"use client";
import { useWishlist } from "@/store/wishlist";

export default function WishlistButton({ product }) {
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.items.some((i) => i._id === product._id));
  return (
    <button
      onClick={() => toggle(product)}
      className={`flex items-center justify-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold transition ${
        wished
          ? "border-gold-500 bg-cream text-gold-600"
          : "border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-gold-400"
      }`}
    >
      {wished ? "♥ Saved" : "♡ Wishlist"}
    </button>
  );
}
