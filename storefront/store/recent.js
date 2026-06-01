"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRecent = create(
  persist(
    (set, get) => ({
      items: [],
      add: (p) => {
        const items = [p, ...get().items.filter((i) => i._id !== p._id)].slice(0, 8);
        set({ items });
      },
    }),
    { name: "shopverse-recent" }
  )
);
