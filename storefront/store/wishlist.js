"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [], // { _id, slug, name, price, image, compareAtPrice }
      toggle: (p) => {
        const exists = get().items.some((i) => i._id === p._id);
        if (exists) {
          set({ items: get().items.filter((i) => i._id !== p._id) });
        } else {
          set({
            items: [
              ...get().items,
              {
                _id: p._id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                compareAtPrice: p.compareAtPrice,
                image: p.images?.[0],
              },
            ],
          });
        }
      },
      has: (id) => get().items.some((i) => i._id === id),
      remove: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      count: () => get().items.length,
    }),
    { name: "shopverse-wishlist" }
  )
);
