import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: "", image: "", description: "" });
  const [err, setErr] = useState("");

  const load = () => api("/categories").then(setCats);
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api("/categories", { method: "POST", body: form });
      setForm({ name: "", image: "", description: "" });
      load();
    } catch (e) { setErr(e.message); }
  };

  const del = async (id) => {
    if (!confirm("Delete category?")) return;
    await api(`/categories/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={add} className="space-y-3 rounded-xl bg-white p-5 shadow-sm h-fit">
          <h2 className="font-bold">Add Category</h2>
          <input className="input" placeholder="Name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Image URL" value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input className="input" placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button className="btn btn-primary w-full">Add</button>
        </form>

        <div className="lg:col-span-2 overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.image && <img src={c.image} alt="" className="h-9 w-9 rounded-full object-cover" />}
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => del(c._id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
