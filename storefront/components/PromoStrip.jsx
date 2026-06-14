const items = [
  { icon: "✦", title: "100% Authentic", sub: "Genuine tabarukat & stones" },
  { icon: "🕋", title: "From Holy Shrines", sub: "Karbala · Najaf · Qom" },
  { icon: "🌍", title: "Worldwide Delivery", sub: "We ship across the globe" },
  { icon: "☎", title: "After-Sale Service", sub: "Dedicated support team" },
];

export default function PromoStrip() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.title} className="flex items-center gap-3 bg-white px-5 py-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-xl text-gold-600">
            {it.icon}
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">{it.title}</p>
            <p className="text-xs text-ink-700/55">{it.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
