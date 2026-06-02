"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Success() {
  const id = useSearchParams().get("id");
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl">✅</p>
      <h1 className="mt-4 text-2xl font-bold">Order placed successfully!</h1>
      <p className="mt-2 text-slate-500">
        Thank you for shopping with ShopVerse.
        {id && <> Your order ID is <span className="font-mono text-sm">{id}</span>.</>}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/account" className="rounded-lg bg-gold-500 px-5 py-3 font-semibold text-ink-900 hover:bg-gold-400">View Orders</Link>
        <Link href="/products" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:border-gold-500">Keep Shopping</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
