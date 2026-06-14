const reviews = [
  { name: "Syed Ali R.", city: "Karachi", text: "The Khak-e-Shifa and turbah arrived beautifully packed and felt truly authentic. May Allah reward this service.", rating: 5 },
  { name: "Fatima Z.", city: "Lahore", text: "Ordered an Irani velvet banner of Imam Hussain (a.s) for our azakhana — the quality is masha’Allah excellent.", rating: 5 },
  { name: "Hussain A.", city: "Islamabad", text: "My Yamani aqeeq ring is genuine and beautifully crafted. Fast delivery and very helpful support on WhatsApp.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="mt-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">Trusted by Momineen</p>
        <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">What Our Customers Say</h2>
        <div className="gold-rule mx-auto mt-3" />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-xl border border-ink-100 bg-white p-6">
            <div className="text-gold-500">{"★".repeat(r.rating)}</div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700/75">“{r.text}”</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 font-display font-bold text-gold-400">
                {r.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-ink-700/50">{r.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
