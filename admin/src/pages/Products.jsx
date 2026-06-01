import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

const fmt = (n) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n || 0);

export default function Products() {
  const [data, setData] = useState({ products: [], pages: 1, page: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api(`/products?limit=20&page=${page}`).then(setData).finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api(`/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : data.products.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category?.name || "—"}</td>
                <td className="px-4 py-3">{fmt(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.countInStock === 0 ? "text-red-500" : ""}>{p.countInStock}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/products/${p._id}`} className="mr-3 text-brand-600 hover:underline">Edit</Link>
                  <button onClick={() => del(p._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)}
              className={`h-8 w-8 rounded ${n === data.page ? "bg-brand-600 text-white" : "bg-white"}`}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
