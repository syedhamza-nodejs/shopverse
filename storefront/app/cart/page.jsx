"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { useSettings } from "@/store/settings";
import Price from "@/components/Price";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, setQty, remove, subtotal } = useCart();
  const settings = useSettings((s) => s.data);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-10">Loading…</div>;

  const sub = subtotal();
  const threshold = settings.freeShippingThreshold ?? 10000;
  const flat = settings.shippingFlat ?? 250;
  const shipping = sub > threshold || sub === 0 ? 0 : flat;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-gold-500 px-6 py-3 font-semibold text-ink-900 hover:bg-gold-400">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div key={it._id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <Link href={`/products/${it.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image src={it.image || "https://picsum.photos/seed/x/200"} alt={it.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${it.slug}`} className="font-medium hover:text-gold-600">{it.name}</Link>
                <Price amount={it.price} className="text-sm text-ink-900 font-bold" />
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button onClick={() => setQty(it._id, it.qty - 1)} className="px-3 py-1">−</button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button onClick={() => setQty(it._id, it.qty + 1)} className="px-3 py-1">+</button>
                  </div>
                  <button onClick={() => remove(it._id)} className="text-sm text-red-500 hover:underline">Remove</button>
                </div>
              </div>
              <Price amount={it.price * it.qty} className="text-right font-bold" />
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><Price amount={sub} /></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{shipping === 0 ? "Free" : <Price amount={shipping} />}</span></div>
            <div className="my-2 border-t border-slate-200" />
            <div className="flex justify-between text-base font-bold"><span>Total</span><Price amount={sub + shipping} className="text-ink-900" /></div>
          </div>
          <Link href="/checkout" className="mt-5 block rounded-lg bg-gold-500 py-3 text-center font-semibold text-ink-900 hover:bg-gold-400">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
