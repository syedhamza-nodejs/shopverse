"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const fallback = [
  { eyebrow: "The Tech Edit", title: "Premium Electronics, Curated for You", subtitle: "Flagship phones, audio & laptops — up to 40% off.", ctaLink: "/category/electronics", ctaText: "Shop Electronics", image: "https://picsum.photos/seed/lux-electronics/1600/700" },
  { eyebrow: "Signature Style", title: "Fashion that Defines You", subtitle: "Handpicked apparel, footwear & accessories.", ctaLink: "/category/fashion", ctaText: "Explore Fashion", image: "https://picsum.photos/seed/lux-fashion/1600/700" },
];

export default function HeroCarousel({ banners }) {
  const slides = banners?.length ? banners : fallback;
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[i % slides.length];

  return (
    <div className="relative h-[340px] overflow-hidden rounded-2xl md:h-[470px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={s.image} alt={s.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/55 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-full max-w-7xl flex-col justify-center px-8 md:px-14">
        <motion.div key={`txt-${i}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {s.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">{s.eyebrow}</p>}
          <h1 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight text-white md:text-5xl">{s.title}</h1>
          {s.subtitle && <p className="mt-4 max-w-md text-sm text-ink-100/80 md:text-base">{s.subtitle}</p>}
          <Link href={s.ctaLink || "/products"} className="mt-7 inline-flex w-fit items-center gap-2 rounded-sm bg-gold-500 px-7 py-3 text-sm font-bold uppercase tracking-wider text-ink-900 transition hover:bg-gold-400">
            {s.ctaText || "Shop Now"} →
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-8 z-10 flex gap-2 md:left-14">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i % slides.length ? "w-8 bg-gold-400" : "w-3 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
