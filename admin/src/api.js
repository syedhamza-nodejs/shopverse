import { useAuth } from "./store.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, { method = "GET", body } = {}) {
  const token = useAuth.getState().token;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    useAuth.getState().logout();
  }
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}
