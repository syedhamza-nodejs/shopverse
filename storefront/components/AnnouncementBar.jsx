"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/store/settings";
import CurrencySwitcher from "./CurrencySwitcher";

export default function AnnouncementBar() {
  const data = useSettings((s) => s.data);
  const messages = data.announcements?.length ? data.announcements : ["✦ Welcome to ShopVerse"];
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="bg-ink-900 text-gold-400">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs tracking-wide">
        <span className="hidden sm:block text-ink-100/70">{data.hours}</span>
        <p className="animate-fade font-medium" key={i}>
          {messages[i % messages.length]}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${data.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:block text-ink-100/70 hover:text-gold-400"
          >
            WhatsApp: {data.phone}
          </a>
          <CurrencySwitcher />
        </div>
      </div>
    </div>
  );
}
