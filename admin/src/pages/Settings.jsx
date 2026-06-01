import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { api("/settings").then(setS).catch((e) => setErr(e.message)); }, []);

  if (!s) return <p className="text-slate-400">Loading…</p>;

  const set = (k, v) => setS({ ...s, [k]: v });
  const setCur = (i, k, v) => {
    const currencies = [...s.currencies];
    currencies[i] = { ...currencies[i], [k]: k === "rate" ? Number(v) : v };
    setS({ ...s, currencies });
  };
  const addCur = () => setS({ ...s, currencies: [...s.currencies, { code: "", symbol: "", rate: 1 }] });
  const delCur = (i) => setS({ ...s, currencies: s.currencies.filter((_, idx) => idx !== i) });

  const save = async () => {
    setSaving(true); setMsg(""); setErr("");
    try {
      const payload = {
        logoText: s.logoText,
        announcements: (Array.isArray(s.announcements) ? s.announcements : String(s.announcements).split("\n")).map((x) => x.trim()).filter(Boolean),
        whatsapp: s.whatsapp, phone: s.phone, email: s.email, hours: s.hours,
        freeShippingThreshold: Number(s.freeShippingThreshold),
        shippingFlat: Number(s.shippingFlat),
        baseCurrency: s.baseCurrency,
        currencies: s.currencies.filter((c) => c.code),
      };
      const updated = await api("/settings", { method: "PUT", body: payload });
      setS(updated);
      setMsg("Settings saved! Refresh the storefront to see changes.");
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const annText = Array.isArray(s.announcements) ? s.announcements.join("\n") : s.announcements;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Site Settings</h1>
      <div className="space-y-6">
        <section className="rounded-xl bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-bold">Branding & Contact</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-sm">Logo Text</label><input className="input mt-1" value={s.logoText} onChange={(e) => set("logoText", e.target.value)} /></div>
            <div><label className="text-sm">Business Hours</label><input className="input mt-1" value={s.hours} onChange={(e) => set("hours", e.target.value)} /></div>
            <div><label className="text-sm">WhatsApp (e.g. 923001234567)</label><input className="input mt-1" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
            <div><label className="text-sm">Phone</label><input className="input mt-1" value={s.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="text-sm">Support Email</label><input className="input mt-1" value={s.email} onChange={(e) => set("email", e.target.value)} /></div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-bold">Announcement Bar (one message per line)</h2>
          <textarea className="input" rows="4" value={annText} onChange={(e) => set("announcements", e.target.value.split("\n"))} />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-bold">Shipping (in base currency)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-sm">Free shipping over</label><input className="input mt-1" type="number" value={s.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", e.target.value)} /></div>
            <div><label className="text-sm">Flat shipping fee</label><input className="input mt-1" type="number" value={s.shippingFlat} onChange={(e) => set("shippingFlat", e.target.value)} /></div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Currencies (base = {s.baseCurrency}, rate relative to base)</h2>
            <button onClick={addCur} className="text-sm text-brand-600 hover:underline">+ Add</button>
          </div>
          <div className="space-y-2">
            {s.currencies.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="input" placeholder="Code (USD)" value={c.code} onChange={(e) => setCur(i, "code", e.target.value)} />
                <input className="input" placeholder="Symbol ($)" value={c.symbol} onChange={(e) => setCur(i, "symbol", e.target.value)} />
                <input className="input" type="number" step="0.0001" placeholder="Rate" value={c.rate} onChange={(e) => setCur(i, "rate", e.target.value)} />
                <button onClick={() => delCur(i)} className="text-red-500 px-2">✕</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">Example: base PKR rate 1; USD rate 0.0036 means Rs 1 = $0.0036.</p>
        </section>

        {err && <p className="text-sm text-red-500">{err}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? "Saving…" : "Save Settings"}</button>
      </div>
    </div>
  );
}
