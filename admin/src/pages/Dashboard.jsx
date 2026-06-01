import { useEffect, useState } from "react";
import { api } from "../api.js";

const fmt = (n) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n || 0);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/stats").then(setStats).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!stats) return <p className="text-slate-400">Loading…</p>;

  const cards = [
    { label: "Revenue", value: fmt(stats.revenue), icon: "💰", color: "bg-green-50 text-green-700" },
    { label: "Orders", value: stats.orders, icon: "🧾", color: "bg-blue-50 text-blue-700" },
    { label: "Products", value: stats.products, icon: "📦", color: "bg-amber-50 text-amber-700" },
    { label: "Customers", value: stats.customers, icon: "👥", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-lg ${c.color}`}>{c.icon}</div>
            <p className="mt-3 text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-bold">Recent Orders</h2>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders?.map((o) => (
              <tr key={o._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8)}</td>
                <td className="px-4 py-3">{o.user?.name || "—"}</td>
                <td className="px-4 py-3">{fmt(o.totalPrice)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
              </tr>
            ))}
            {!stats.recentOrders?.length && (
              <tr><td colSpan="4" className="px-4 py-6 text-center text-slate-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
