export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic fetch wrapper. `token` optional for authed requests.
export async function api(path, { method = "GET", body, token, cache, next } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// Server-side fetch helpers (with ISR revalidation)
export const getProducts = (query = "") =>
  api(`/products${query}`, { next: { revalidate: 60 } });

export const getFeatured = () =>
  api(`/products/featured`, { next: { revalidate: 120 } });

export const getProduct = (slug) =>
  api(`/products/${slug}`, { next: { revalidate: 60 } });

export const getCategories = () =>
  api(`/categories`, { next: { revalidate: 300 } });

export const getBanners = () =>
  api(`/banners`, { next: { revalidate: 60 } });

export const getSettings = () =>
  api(`/settings`, { next: { revalidate: 60 } });

export const getFilterMeta = (query = "") =>
  api(`/products/filters${query}`, { next: { revalidate: 120 } });
