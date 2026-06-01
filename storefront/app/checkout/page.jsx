"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useSettings } from "@/store/settings";
import { api } from "@/lib/api";
import Price from "@/components/Price";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { user, token } = useAuth();
  const settings = useSettings((s) => s.data);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [method, setMethod] = useState("cod");
  const [form, setForm] = useState({
    fullName: "", line1: "", city: "", state: "", postalCode: "", phone: "",
  });

  useEffect(() => {
    setMounted(true);
    if (user) setForm((f) => ({ ...f, fullName: user.name }));
  }, [user]);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-10">Loading…</div>;

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Please sign in to checkout</h1>
        <button onClick={() => router.push("/login?redirect=/checkout")} className="mt-4 rounded-lg bg-ink-900 px-6 py-3 font-semibold text-white">
          Sign in
        </button>
      </div>
    );
  }

  const sub = subtotal();
  const shipping = sub > (settings.freeShippingThreshold ?? 10000) ? 0 : (settings.shippingFlat ?? 250);
  const total = sub + shipping;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const order = await api("/orders", {
        method: "POST",
        token,
        body: {
          items: items.map((i) => ({ product: i._id, qty: i.qty })),
          shippingAddress: form,
          paymentMethod: method,
        },
      });

      if (method === "card") {
        // Demo: mark as paid. (With real Stripe keys use /payments/create-intent + Elements.)
        await api(`/payments/${order._id}/mark-paid`, {
          method: "POST",
          token,
          body: { paymentId: "demo_card" },
        }).catch(() => {});
      }

      clear();
      router.push(`/order-success?id=${order._id}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">Your cart is empty.</div>;
  }

  return (
    <form onSubmit={placeOrder} className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Shipping Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" value={form.fullName} onChange={set("fullName")} className="input" />
            <input required placeholder="Phone" value={form.phone} onChange={set("phone")} className="input" />
            <input required placeholder="Address line" value={form.line1} onChange={set("line1")} className="input sm:col-span-2" />
            <input required placeholder="City" value={form.city} onChange={set("city")} className="input" />
            <input placeholder="State / Province" value={form.state} onChange={set("state")} className="input" />
            <input placeholder="Postal code" value={form.postalCode} onChange={set("postalCode")} className="input" />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Payment Method</h2>
          <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input type="radio" name="pay" checked={method === "cod"} onChange={() => setMethod("cod")} />
            <span>💵 Cash on Delivery</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input type="radio" name="pay" checked={method === "card"} onChange={() => setMethod("card")} />
            <span>💳 Card (demo)</span>
          </label>
        </section>
      </div>

      <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
        <div className="space-y-1 text-sm">
          {items.map((i) => (
            <div key={i._id} className="flex justify-between">
              <span className="text-slate-500">{i.name} × {i.qty}</span>
              <Price amount={i.price * i.qty} />
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-slate-200" />
        <div className="flex justify-between text-sm"><span className="text-slate-500">Shipping</span><span>{shipping === 0 ? "Free" : <Price amount={shipping} />}</span></div>
        <div className="mt-2 flex justify-between text-base font-bold"><span>Total</span><Price amount={total} className="text-ink-900" /></div>

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-sm bg-gold-500 py-3 font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400 disabled:opacity-60">
          {loading ? "Placing order…" : "Place Order"}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.input:focus) { border-color: #c9a227; }
      `}</style>
    </form>
  );
}
