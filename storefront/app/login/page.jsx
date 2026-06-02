"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const data = await api("/auth/login", { method: "POST", body: form });
      setAuth(data);
      router.push(redirect);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to your ShopVerse account.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-gold-500" />
        <input required type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-gold-500" />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-ink-900 hover:bg-gold-400 disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        No account? <Link href="/register" className="font-semibold text-gold-600">Register</Link>
      </p>
      <div className="mt-6 rounded-lg bg-slate-100 p-3 text-xs text-slate-500">
        Demo: <b>customer@shopverse.com</b> / <b>customer123</b>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
