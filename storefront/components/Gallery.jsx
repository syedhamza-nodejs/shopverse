"use client";
import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images = [], name }) {
  const pics = images.length ? images : ["https://picsum.photos/seed/x/600"];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-ink-100 bg-cream cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
      >
        <Image
          src={pics[active]}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-200"
          style={zoom ? { transform: "scale(2)", transformOrigin: `${pos.x}% ${pos.y}%` } : undefined}
        />
        <span className="absolute bottom-3 right-3 rounded-sm bg-ink-900/70 px-2 py-1 text-[10px] uppercase tracking-wide text-gold-400">
          Hover to zoom
        </span>
      </div>
      {pics.length > 1 && (
        <div className="mt-3 flex gap-3">
          {pics.map((p, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${i === active ? "border-gold-500" : "border-transparent hover:border-ink-100"}`}>
              <Image src={p} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
