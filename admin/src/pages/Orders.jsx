import { useEffect, useState } from "react";
import { api } from "../api.js";

const fmt = (n) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n || 0);

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api("/orders").then(setOrders).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api(`/orders/${id}/status`, { method: "PUT", body: { status } });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">No orders</td></tr>
            ) : orders.map((o) => (
              <tr key={o._id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8)}<br/>
                  <span className="text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3">{o.user?.name}<br/><span className="text-xs text-slate-400">{o.user?.email}</span></td>
                <td className="px-4 py-3 max-w-xs text-xs text-slate-500">
                  {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                </td>
                <td className="px-4 py-3 font-semibold">{fmt(o.totalPrice)}</td>
                <td className="px-4 py-3">
                  {o.paymentMethod.toUpperCase()}<br/>
                  <span className={o.isPaid ? "text-green-600 text-xs" : "text-amber-600 text-xs"}>
                    {o.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
