"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [], // { _id, slug, name, price, image, qty, countInStock }
      add: (product, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i._id === product._id);
        if (idx > -1) {
          items[idx].qty = Math.min(
            items[idx].qty + qty,
            product.countInStock || 99
          );
        } else {
          items.push({
            _id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            countInStock: product.countInStock,
            qty,
          });
        }
        set({ items });
      },
      setQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        }),
      remove: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((a, i) => a + i.qty, 0),
      subtotal: () => get().items.reduce((a, i) => a + i.price * i.qty, 0),
    }),
    { name: "shopverse-cart" }
  )
);
