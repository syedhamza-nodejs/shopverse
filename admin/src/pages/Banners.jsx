import { useEffect, useState } from "react";
import { api } from "../api.js";

const empty = { eyebrow: "", title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaLink: "/products", order: 0, active: true };

export default function Banners() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  const load = () => api("/banners/all").then(setList).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      if (editId) await api(`/banners/${editId}`, { method: "PUT", body: payload });
      else await api("/banners", { method: "POST", body: payload });
      setForm(empty); setEditId(null); load();
    } catch (e) { setErr(e.message); }
  };

  const edit = (b) => { setEditId(b._id); setForm({ ...empty, ...b }); window.scrollTo(0, 0); };
  const del = async (id) => { if (confirm("Delete banner?")) { await api(`/banners/${id}`, { method: "DELETE" }); load(); } };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Hero Banners</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-6 shadow-sm h-fit">
          <h2 className="font-bold">{editId ? "Edit Banner" : "Add Banner"}</h2>
          <input className="input" placeholder="Eyebrow (e.g. The Tech Edit)" value={form.eyebrow} onChange={set("eyebrow")} />
          <input className="input" placeholder="Title *" required value={form.title} onChange={set("title")} />
          <input className="input" placeholder="Subtitle" value={form.subtitle} onChange={set("subtitle")} />
          <input className="input" placeholder="Image URL *" required value={form.image} onChange={set("image")} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="CTA text" value={form.ctaText} onChange={set("ctaText")} />
            <input className="input" placeholder="CTA link (/category/...)" value={form.ctaLink} onChange={set("ctaLink")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="number" placeholder="Order" value={form.order} onChange={set("order")} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={set("active")} /> Active</label>
          </div>
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="flex gap-2">
            <button className="btn btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" onClick={() => { setForm(empty); setEditId(null); }} className="btn bg-slate-200">Cancel</button>}
          </div>
        </form>

        <div className="space-y-3">
          {list.map((b) => (
            <div key={b._id} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
              {b.image && <img src={b.image} alt="" className="h-20 w-28 rounded object-cover" />}
              <div className="flex-1">
                <p className="text-xs text-slate-400">{b.eyebrow} {!b.active && "· (inactive)"}</p>
                <p className="font-semibold">{b.title}</p>
                <p className="text-xs text-slate-500">{b.ctaText} → {b.ctaLink} · order {b.order}</p>
                <div className="mt-1">
                  <button onClick={() => edit(b)} className="mr-3 text-brand-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => del(b._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-slate-400">No banners yet.</p>}
        </div>
      </div>
    </div>
  );
}
