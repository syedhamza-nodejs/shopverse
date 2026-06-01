# 🛒 ShopVerse — Professional MERN + Next.js Ecommerce

Fast, modern, full-stack ecommerce platform (JSM-style multi-category store).

## 🧱 Architecture

```
ecommerce website/
├── backend/      → Express + MongoDB REST API (auth, products, orders, payments)
├── storefront/   → Next.js (App Router) customer store — SSR, super fast & SEO friendly
└── admin/        → Vite + React admin dashboard — manage products & orders
```

| Layer       | Tech                                             |
|-------------|--------------------------------------------------|
| Database    | MongoDB (Atlas or local) + Mongoose              |
| Backend     | Node.js + Express, JWT auth, Stripe payments     |
| Storefront  | Next.js 15 (App Router) + Tailwind CSS           |
| Admin       | Vite + React + Tailwind                          |

## 🚀 Quick start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, STRIPE keys
npm run seed           # load demo multi-category products
npm run dev            # http://localhost:5000
```

### 2. Storefront (Next.js)
```bash
cd storefront
npm install
npm run dev            # http://localhost:3000
```

### 3. Admin (Vite)
```bash
cd admin
npm install
npm run dev            # http://localhost:5173
```

## 🔑 MongoDB

No local Mongo? Use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and
paste its connection string into `backend/.env` as `MONGO_URI`.

## ⚡ Performance notes
- Next.js SSR/ISR + image optimization for fast first paint & SEO
- API pagination + lean queries + indexes on Mongo
- Tailwind for tiny CSS, code-splitting by route
