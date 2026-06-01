"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULTS = {
  logoText: "ShopVerse",
  announcements: [
    "✦ Enjoy FREE delivery on online payments",
    "✦ Get 10% off on orders over Rs 15,000",
    "✦ Worldwide delivery available — WhatsApp us to order",
  ],
  whatsapp: "923000000000",
  phone: "0300-0000000",
  email: "support@shopverse.com",
  hours: "Mon–Sat · 9am–8pm",
  freeShippingThreshold: 10000,
  shippingFlat: 250,
  baseCurrency: "PKR",
  currencies: [{ code: "PKR", symbol: "Rs", rate: 1 }],
};

export const useSettings = create(
  persist(
    (set, get) => ({
      data: DEFAULTS,
      currency: "PKR", // selected currency code
      loaded: false,
      setData: (data) => set({ data: { ...DEFAULTS, ...data }, loaded: true }),
      setCurrency: (code) => set({ currency: code }),
      activeCurrency: () => {
        const { data, currency } = get();
        return (
          data.currencies?.find((c) => c.code === currency) ||
          data.currencies?.[0] || { code: "PKR", symbol: "Rs", rate: 1 }
        );
      },
    }),
    {
      name: "shopverse-settings",
      partialize: (s) => ({ currency: s.currency }), // only persist chosen currency
    }
  )
);
