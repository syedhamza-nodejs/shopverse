"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { formatPKR } from "@/lib/format";

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push("/login?redirect=/account");
      return;
    }
    api("/orders/mine", { token })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mounted, token, router]);

  if (!mounted || !token) return <div className="mx-auto max-w-7xl px-4 py-10">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user?.name} 👋</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:border-red-400 hover:text-red-600">
          Logout
        </button>
      </div>

      <h2 className="mt-8 mb-4 text-lg font-bold">My Orders</h2>
      {loading ? (
        <p className="text-slate-400">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
          No orders yet. <Link href="/products" className="text-gold-600 font-semibold">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-slate-400">#{o._id.slice(-8)}</p>
                  <p className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status] || "bg-slate-100"}`}>
                  {o.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-600">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">{o.paymentMethod.toUpperCase()} · {o.isPaid ? "Paid" : "Unpaid"}</span>
                <span className="font-bold text-ink-900">{formatPKR(o.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
