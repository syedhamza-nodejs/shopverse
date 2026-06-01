# 🚀 ShopVerse Deployment Guide (Free)

Three pieces go live:
- **Database** → MongoDB Atlas (already set up ✅)
- **Backend API** → Render (free)
- **Storefront + Admin** → Vercel (free, two projects)

---

## STEP 0 — Push code to GitHub

```powershell
cd "d:\ecommerce website"
git init
git add .
git commit -m "ShopVerse ecommerce"
```
Then create an empty repo on https://github.com/new (name: `shopverse`) and:
```powershell
git remote add origin https://github.com/<your-username>/shopverse.git
git branch -M main
git push -u origin main
```

---

## STEP 1 — Backend on Render

1. Go to https://render.com → sign up (GitHub login).
2. **New + → Web Service** → connect your `shopverse` repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. **Environment** → add these variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | *(your Atlas connection string from backend/.env)* |
   | `JWT_SECRET` | *(any long random text)* |
5. Click **Create Web Service**. Wait for deploy → you get a URL like
   `https://shopverse-backend.onrender.com`
6. Test it: open `https://shopverse-backend.onrender.com/api/health` → should show `{"status":"ok"}`.
7. **Seed the live DB once** (from your PC, pointing at Atlas — already seeded ✅, skip if data exists).

> ⚠️ Free Render sleeps after 15 min idle; first request then takes ~30–50s to wake. Normal for free tier.

---

## STEP 2 — Storefront on Vercel

1. Go to https://vercel.com → sign up (GitHub login) → **Add New → Project** → import `shopverse`.
2. Settings:
   - **Root Directory:** `storefront`
   - Framework: **Next.js** (auto-detected)
3. **Environment Variables** → add:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://shopverse-backend.onrender.com/api` |
4. **Deploy** → you get `https://shopverse-xxxx.vercel.app` — **this is your customer link!** 🎉

---

## STEP 3 — Admin on Vercel (second project)

1. Vercel → **Add New → Project** → import the **same** `shopverse` repo again.
2. Settings:
   - **Root Directory:** `admin`
   - Framework: **Vite** (auto-detected)
3. **Environment Variables** → add:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://shopverse-backend.onrender.com/api` |
4. **Deploy** → `https://shopverse-admin-xxxx.vercel.app` (admin login: admin@shopverse.com / admin123)

---

## STEP 4 — (Optional) tighten CORS

Back in Render → backend env vars, set:
- `CLIENT_URL` = your storefront Vercel URL
- `ADMIN_URL` = your admin Vercel URL

(CORS already allows any `*.vercel.app` for demos, so this is optional.)

---

## ✅ Done
Share the **storefront URL** with your customer. Update products/banners/settings anytime from the **admin URL** — changes are instant.
