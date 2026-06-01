import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

const empty = {
  name: "", brand: "", description: "", price: "", compareAtPrice: "",
  countInStock: "", category: "", images: "", featured: false,
  highlights: "", badges: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [cats, setCats] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/categories").then(setCats);
  }, []);

  useEffect(() => {
    if (!editing) return;
    // products are looked up by slug publicly; fetch list & find by id for edit
    api(`/products?limit=200`).then((d) => {
      const p = d.products.find((x) => x._id === id);
      if (p) {
        setForm({
          name: p.name, brand: p.brand, description: p.description,
          price: p.price, compareAtPrice: p.compareAtPrice || "",
          countInStock: p.countInStock, category: p.category?._id || p.category,
          images: (p.images || []).join(", "), featured: p.featured,
          highlights: (p.highlights || []).join("\n"),
          badges: (p.badges || []).join(", "),
        });
      }
    });
  }, [id, editing]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      countInStock: Number(form.countInStock),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      badges: form.badges.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await api(`/products/${id}`, { method: "PUT", body: payload });
      else await api("/products", { method: "POST", body: payload });
      navigate("/products");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{editing ? "Edit" : "Add"} Product</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className="input mt-1" required value={form.name} onChange={set("name")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Brand</label>
            <input className="input mt-1" value={form.brand} onChange={set("brand")} />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select className="input mt-1" required value={form.category} onChange={set("category")}>
              <option value="">Select…</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea className="input mt-1" rows="3" required value={form.description} onChange={set("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Price (PKR)</label>
            <input className="input mt-1" type="number" required value={form.price} onChange={set("price")} />
          </div>
          <div>
            <label className="text-sm font-medium">Compare price</label>
            <input className="input mt-1" type="number" value={form.compareAtPrice} onChange={set("compareAtPrice")} />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <input className="input mt-1" type="number" required value={form.countInStock} onChange={set("countInStock")} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Image URLs (comma separated)</label>
          <input className="input mt-1" placeholder="https://… , https://…" value={form.images} onChange={set("images")} />
        </div>
        <div>
          <label className="text-sm font-medium">Highlights (one per line)</label>
          <textarea className="input mt-1" rows="4" placeholder={"30-hour battery\nNoise cancellation\nUSB-C charging"} value={form.highlights} onChange={set("highlights")} />
        </div>
        <div>
          <label className="text-sm font-medium">Badges (comma separated)</label>
          <input className="input mt-1" placeholder="Best Seller, Imported, New" value={form.badges} onChange={set("badges")} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={set("featured")} /> Featured product
        </label>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <div className="flex gap-3">
          <button disabled={loading} className="btn btn-primary">{loading ? "Saving…" : "Save Product"}</button>
          <button type="button" onClick={() => navigate("/products")} className="btn bg-slate-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}
