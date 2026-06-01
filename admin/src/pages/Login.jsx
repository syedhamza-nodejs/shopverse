import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../store.js";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ email: "admin@shopverse.com", password: "admin123" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/login", { method: "POST", body: form });
      if (data.user.role !== "admin") throw new Error("Not an admin account");
      setAuth(data);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-extrabold">
          <span className="text-brand-600">Shop</span>Verse Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage your store.</p>
        <div className="mt-6 space-y-4">
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Demo: admin@shopverse.com / admin123
        </p>
      </form>
    </div>
  );
}
