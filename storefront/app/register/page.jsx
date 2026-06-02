"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/register", { method: "POST", body: form });
      setAuth(data);
      router.push("/");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Join ShopVerse and start shopping.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required placeholder="Full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-gold-500" />
        <input required type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-gold-500" />
        <input required type="password" minLength={6} placeholder="Password (min 6 chars)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-gold-500" />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-ink-900 hover:bg-gold-400 disabled:opacity-60">
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="font-semibold text-gold-600">Sign in</Link>
      </p>
    </div>
  );
}
