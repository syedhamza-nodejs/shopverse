import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Setting from "../models/Setting.js";
import Banner from "../models/Banner.js";

const img = (seed) => `https://picsum.photos/seed/${seed}/700/700`;

const categories = [
  { name: "Tabarukat", featured: true, image: img("cat-tabarukat"), description: "Blessed items (tabarruk) from the holy shrines" },
  { name: "Banners & Alam", featured: true, image: img("cat-banners"), description: "Irani velvet banners & alam of the Masaib" },
  { name: "Aqeeq & Rings", featured: true, image: img("cat-aqeeq"), description: "Yamani, Sulaimani & Firoza silver rings" },
  { name: "Taveezat", featured: true, image: img("cat-taveezat"), description: "Authentic hirz & taveezat" },
  { name: "Tasbeeh & Janamaz", featured: false, image: img("cat-tasbeeh"), description: "Tasbeeh, mohr & prayer mats" },
  { name: "Hijab & Chadar", featured: false, image: img("cat-hijab"), description: "Namazi chadar, abaya & hijab" },
  { name: "Islamic Books", featured: false, image: img("cat-books"), description: "Quran, Mafatih, duas & ziyarat" },
  { name: "Attar & Fragrance", featured: false, image: img("cat-attar"), description: "Mushk, oud & natural attar" },
];

// p(name, brand, price, compareAt, desc, highlights[], specs{}, badges[])
const p = (name, brand, price, compareAtPrice, description, highlights = [], specs = {}, badges = []) => ({
  name, brand, price, compareAtPrice, description, highlights,
  specs: Object.entries(specs).map(([key, value]) => ({ key, value })),
  badges,
});

const productsByCat = {
  Tabarukat: [
    p("Khak-e-Shifa (Turbah) from Karbala", "Karbala", 1499, 1999,
      "Authentic Khak-e-Shifa (sacred clay) brought from the holy land of Karbala-e-Mualla. A cherished tabarruk for sajdah, kept and carried by the lovers of Ahlebait (a.s) with deep reverence.",
      ["Sacred clay from Karbala-e-Mualla", "Ideal for sajdah & tabarruk", "Carefully packed & sealed", "100% authentic, sourced with care"],
      { Origin: "Karbala, Iraq", Type: "Khak-e-Shifa", Packaging: "Sealed pouch" },
      ["Authentic", "From Karbala"]),
    p("Mohr / Turbah — Najaf-e-Ashraf", "Najaf", 999, 0,
      "A finely pressed turbah (mohr) from the soil of Najaf-e-Ashraf, near the shrine of Mawla Ali (a.s). Smooth finish, comfortable for daily namaz.",
      ["Soil of Najaf-e-Ashraf", "Smooth pressed finish", "Comfortable for daily salah", "Long-lasting"],
      { Origin: "Najaf, Iraq", Shape: "Round", Use: "Sajdah" },
      ["Authentic", "Handmade"]),
    p("Tabarruk Gift Box (Karbala & Qom)", "Markaz", 3999, 4999,
      "A curated tabarruk box containing blessed items from Karbala and Qom — turbah, tasbeeh and a ziyarat booklet. A heartfelt gift for your loved ones.",
      ["Curated blessed items", "Turbah + tasbeeh + ziyarat booklet", "Elegant gift packaging", "Perfect for Niyaz & gifting"],
      { Includes: "Turbah, Tasbeeh, Booklet", Origin: "Karbala & Qom" },
      ["Best Seller", "Gift Ready"]),
    p("Ziyarat Cloth — Tabarruk (Roza Mubarak)", "Mashhad", 2499, 0,
      "A soft cloth touched to the holy shrine (tabarruk), kept by the devotees with love and used for barakah and shifa. Sourced respectfully from Mashhad.",
      ["Tabarruk from the holy Roza", "Soft premium cloth", "Kept for barakah & shifa", "Respectfully sourced"],
      { Origin: "Mashhad, Iran", Material: "Cotton" },
      ["Imported", "Authentic"]),
  ],
  "Banners & Alam": [
    p("Imam Hussain (a.s) Irani Velvet Banner", "Irani", 5999, 7999,
      "A premium Irani velvet banner with elegant calligraphy and rich detailing dedicated to Sayyed-ush-Shuhada Imam Hussain (a.s). Perfect for azakhana, majlis and home during Muharram.",
      ["Premium Irani velvet", "Fine gold-thread calligraphy", "Ideal for azakhana & majlis", "Durable, vibrant colours"],
      { Material: "Irani Velvet", Size: "Large", Use: "Azadari / Décor" },
      ["Imported", "Best Seller"]),
    p("Panjtan Pak (a.s) Velvet Banner", "Irani", 5499, 6999,
      "A beautiful velvet banner honouring the Panjtan Pak (a.s), with intricate embroidery and luxurious finish. A noble addition to any home or imambargah.",
      ["Honouring Panjtan Pak (a.s)", "Intricate embroidery", "Luxurious velvet finish", "Wall-ready with hanging rod"],
      { Material: "Velvet", Work: "Embroidered" },
      ["Imported"]),
    p("Ya Abbas (a.s) Alam", "Markaz", 8999, 0,
      "A finely crafted alam dedicated to Hazrat Abbas (a.s), the standard-bearer of Karbala. Polished metal panja with detailed engraving — a symbol of loyalty and courage.",
      ["Dedicated to Hazrat Abbas (a.s)", "Polished engraved panja", "Symbol of loyalty & valour", "For juloos & azakhana"],
      { Material: "Polished metal", Type: "Alam / Panja" },
      ["Handcrafted"]),
    p("Imam Ali (a.s) Roll Banner", "Irani", 3999, 4999,
      "A vertical roll banner with majestic calligraphy of Mawla Ali (a.s). Compact, easy to roll and display anywhere.",
      ["Majestic Ali (a.s) calligraphy", "Easy roll & display", "Compact storage", "Premium print"],
      { Type: "Roll banner", Material: "Vinyl/Velvet" },
      ["New"]),
  ],
  "Aqeeq & Rings": [
    p("Yamani Aqeeq Silver Ring (Red)", "Yamani", 6999, 8999,
      "A genuine Yamani Aqeeq (red agate) set in pure 925 silver. The sunnah stone of the Ahlebait (a.s), known for its barakah. Handcrafted by skilled artisans.",
      ["Genuine Yamani Aqeeq (red)", "Pure 925 sterling silver", "Handcrafted setting", "Adjustable / sized on request"],
      { Stone: "Yamani Aqeeq", Metal: "925 Silver", Origin: "Yemen" },
      ["Authentic", "Handcrafted"]),
    p("Aqeeq-e-Sulaimani Silver Ring", "Sulaimani", 4999, 5999,
      "A striking Sulaimani Aqeeq ring in sterling silver, prized for its bands of black and white. A timeless, masculine design.",
      ["Natural Sulaimani Aqeeq", "Sterling silver band", "Classic masculine design", "Comes in a gift box"],
      { Stone: "Sulaimani Aqeeq", Metal: "925 Silver" },
      ["Best Seller"]),
    p("Firoza (Turquoise) Nishapuri Ring", "Nishapuri", 7999, 9999,
      "An elegant Nishapuri Firoza (turquoise) from Iran, set in finely worked silver. The sky-blue stone is a favourite of the lovers of Ahlebait (a.s).",
      ["Nishapuri Firoza from Iran", "Fine silver craftsmanship", "Vivid sky-blue stone", "Certificate of authenticity"],
      { Stone: "Firoza (Turquoise)", Origin: "Nishapur, Iran", Metal: "Silver" },
      ["Imported", "Authentic"]),
    p("Aqeeq Black Silver Ring (Men's)", "Aqeeq", 3499, 0,
      "A sober black aqeeq ring in sterling silver — understated and elegant for everyday wear.",
      ["Natural black aqeeq", "Sterling silver", "Everyday elegant wear", "Durable polish"],
      { Stone: "Black Aqeeq", Metal: "925 Silver" },
      ["Handcrafted"]),
  ],
  Taveezat: [
    p("Hirz-e-Jawad (a.s) Silver Taweez", "Markaz", 2999, 3499,
      "The renowned Hirz-e-Jawad written with care and encased in a pure silver taweez. Worn by the lovers of Ahlebait (a.s) for protection and barakah.",
      ["Hirz-e-Jawad (a.s)", "Pure silver casing", "Carefully written & sealed", "For protection & barakah"],
      { Casing: "925 Silver", Type: "Hirz / Taweez" },
      ["Authentic", "Handmade"]),
    p("Hirz-e-Yamani Taweez", "Markaz", 2499, 0,
      "The Hirz-e-Yamani, beautifully inscribed and sealed in a protective casing. A cherished spiritual keepsake.",
      ["Hirz-e-Yamani inscription", "Protective sealed casing", "Cherished spiritual keepsake", "Lightweight to carry"],
      { Type: "Hirz / Taweez", Sealed: "Yes" },
      ["Authentic"]),
    p("Naad-e-Ali Taweez (on Deer Hide)", "Markaz", 1999, 2499,
      "Naad-e-Ali written by hand on deer hide (aahu) and sealed — a traditional taweez kept with deep love and reverence.",
      ["Hand-written Naad-e-Ali", "Traditional deer-hide (aahu)", "Sealed for protection", "Reverently prepared"],
      { Material: "Deer hide", Type: "Taweez" },
      ["Handmade"]),
    p("Loh-e-Qamar Bani Hashim", "Markaz", 3499, 0,
      "A protective loh dedicated to Qamar Bani Hashim, Hazrat Abbas (a.s), prepared with care and presented in a silver casing.",
      ["Dedicated to Qamar Bani Hashim", "Silver casing", "Prepared with care", "Spiritual keepsake"],
      { Casing: "Silver", Type: "Loh" },
      ["Authentic"]),
  ],
  "Tasbeeh & Janamaz": [
    p("Khak-e-Shifa Tasbeeh (Karbala Clay)", "Karbala", 1799, 2299,
      "A 100-bead tasbeeh made from the blessed clay of Karbala (Khak-e-Shifa). Light, smooth beads that bring barakah to your zikr.",
      ["100 beads of Karbala clay", "Smooth, light beads", "For tasbeeh-e-Fatima (s.a) & zikr", "Comes in a pouch"],
      { Beads: "100", Material: "Khak-e-Shifa", Origin: "Karbala" },
      ["Authentic", "Best Seller"]),
    p("Aqeeq Tasbeeh — 100 Beads", "Aqeeq", 3499, 4499,
      "An elegant tasbeeh of natural aqeeq stones, prized for its beauty and the barakah of the sunnah stone.",
      ["Natural aqeeq stone beads", "100 beads + counter", "Elegant & durable", "Premium presentation box"],
      { Beads: "100", Stone: "Aqeeq" },
      ["Premium"]),
    p("Turbah & Tasbeeh Namaz Set", "Markaz", 2499, 0,
      "A complete namaz set including a Karbala turbah and a matching tasbeeh, presented in an elegant box — perfect for gifting.",
      ["Turbah + matching tasbeeh", "Elegant gift box", "Karbala-sourced turbah", "Ideal for gifting"],
      { Includes: "Turbah + Tasbeeh", Origin: "Karbala" },
      ["Gift Ready"]),
    p("Premium Velvet Prayer Mat (Janamaz)", "Irani", 4999, 6499,
      "A luxurious thick velvet janamaz with elegant mehrab design and soft padding for comfortable, focused ibadah.",
      ["Thick premium velvet", "Elegant mehrab design", "Soft padded comfort", "Non-slip backing"],
      { Material: "Velvet", Size: "110 × 70 cm" },
      ["Imported"]),
  ],
  "Hijab & Chadar": [
    p("Irani Namazi Chadar", "Irani", 3999, 4999,
      "A premium Irani namazi chadar in soft, flowing fabric with subtle floral print — light, opaque and perfect for salah.",
      ["Soft premium Irani fabric", "Light & fully opaque", "Subtle elegant print", "Comfortable for salah"],
      { Fabric: "Premium", Type: "Namazi Chadar", Origin: "Iran" },
      ["Imported", "Best Seller"]),
    p("Premium Abaya — Plain Black", "Markaz", 4499, 5499,
      "A graceful, flowing black abaya in breathable premium fabric with a modest, elegant cut for everyday modest wear.",
      ["Breathable premium fabric", "Modest elegant cut", "Flowing comfortable fit", "Everyday & occasion wear"],
      { Fabric: "Nida/Premium", Colour: "Black" },
      ["New"]),
    p("Hijab & Underscarf Set", "Markaz", 1999, 2499,
      "A complete hijab set including a soft jersey hijab and a comfortable underscarf — breathable and easy to style.",
      ["Soft jersey hijab", "Comfortable underscarf", "Breathable & easy to style", "Multiple colours"],
      { Includes: "Hijab + Underscarf", Fabric: "Jersey" },
      ["Value Pack"]),
  ],
  "Islamic Books": [
    p("Quran-e-Majeed with Urdu Translation", "Quran", 2499, 2999,
      "A beautifully printed Quran-e-Majeed with clear Arabic script and Urdu translation, on premium paper with a durable hardcover.",
      ["Clear bold Arabic script", "Urdu translation", "Premium paper & hardcover", "Ribbon bookmark"],
      { Language: "Arabic + Urdu", Binding: "Hardcover" },
      ["Best Seller"]),
    p("Mafatih-ul-Jinan (Keys to Heaven)", "Mafatih", 2999, 0,
      "The complete Mafatih-ul-Jinan — duas, ziyarat and aamaal — with Arabic text and Urdu translation. An essential for every momin home.",
      ["Complete duas & ziyarat", "Arabic + Urdu translation", "Premium print & binding", "Essential daily companion"],
      { Language: "Arabic + Urdu", Pages: "1000+" },
      ["Best Seller"]),
    p("Sahifa-e-Sajjadia", "Sahifa", 1799, 2199,
      "The Psalms of the Ahlebait — the supplications of Imam Zain-ul-Abideen (a.s), with Arabic and translation.",
      ["Supplications of Imam Sajjad (a.s)", "Arabic + translation", "Quality binding", "Spiritual everyday read"],
      { Language: "Arabic + Urdu", Binding: "Hardcover" },
      ["New"]),
    p("Nahj-ul-Balagha", "Nahjul", 2299, 2799,
      "The peak of eloquence — sermons, letters and sayings of Amir-ul-Momineen Ali (a.s), with translation and commentary.",
      ["Words of Mawla Ali (a.s)", "Sermons, letters & sayings", "Translation + commentary", "Premium hardcover"],
      { Language: "Arabic + Urdu", Binding: "Hardcover" },
      ["Best Seller"]),
    p("Dua Kumail & Dua Nudba Booklet", "Markaz", 499, 699,
      "A handy pocket booklet of Dua Kumail and Dua Nudba with translation — perfect for Thursday nights and Friday aamaal.",
      ["Dua Kumail + Dua Nudba", "Pocket-size booklet", "With translation", "Perfect for weekly aamaal"],
      { Size: "Pocket", Language: "Arabic + Urdu" },
      ["Value Pack"]),
  ],
  "Attar & Fragrance": [
    p("Attar Mushk (Misk) — Premium", "Attar", 1499, 1999,
      "A rich, long-lasting Mushk (misk) attar — the fragrance loved in the sunnah. Alcohol-free and pure, in a roll-on bottle.",
      ["Rich long-lasting Mushk", "Alcohol-free & pure", "Sunnah fragrance", "Convenient roll-on bottle"],
      { Volume: "12 ml", Type: "Mushk Attar", "Alcohol-Free": "Yes" },
      ["Best Seller"]),
    p("Bakhoor / Loban (Incense)", "Bakhoor", 1299, 0,
      "Premium bakhoor (loban) for filling your home and majlis with a beautiful, soothing fragrance.",
      ["Premium fragrant bakhoor", "Long-lasting aroma", "For home & majlis", "Natural ingredients"],
      { Type: "Bakhoor / Loban", Weight: "50 g" },
      ["New"]),
    p("Attar Oud (Oudh) — Luxury", "Attar", 2999, 3999,
      "A deep, luxurious Oud attar — warm and woody, alcohol-free, for those who appreciate a noble, lasting scent.",
      ["Deep luxurious Oud", "Warm woody profile", "Alcohol-free & long-lasting", "Elegant gift bottle"],
      { Volume: "12 ml", Type: "Oud Attar", "Alcohol-Free": "Yes" },
      ["Premium", "Imported"]),
    p("Rose (Gulab) Attar", "Attar", 1199, 1499,
      "A fresh, gentle Gulab (rose) attar — soft and pleasant, alcohol-free, loved by all ages.",
      ["Fresh gentle rose scent", "Alcohol-free", "Soft & pleasant sillage", "Roll-on bottle"],
      { Volume: "12 ml", Type: "Rose Attar" },
      ["Value Pack"]),
  ],
};

const banners = [
  { eyebrow: "From the Holy Shrines", title: "Authentic Tabarukat of Karbala, Najaf & Qom", subtitle: "Blessed turbah, ziyarat cloth & sacred keepsakes — sourced with reverence.", image: img("hero-tabarukat-x"), ctaText: "Explore Tabarukat", ctaLink: "/category/tabarukat", order: 1 },
  { eyebrow: "Irani Velvet Collection", title: "Banners & Alam of the Masaib", subtitle: "Premium velvet banners of the Ahlebait (a.s) for your azakhana & home.", image: img("hero-banners-x"), ctaText: "View Banners", ctaLink: "/category/banners-alam", order: 2 },
  { eyebrow: "The Sunnah Stone", title: "Yamani Aqeeq & Silver Rings", subtitle: "Handcrafted aqeeq, firoza & sulaimani rings in pure silver.", image: img("hero-aqeeq-x"), ctaText: "Shop Rings", ctaLink: "/category/aqeeq-rings", order: 3 },
];

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Setting.deleteMany(), Banner.deleteMany()]);
    console.log("🗑️  All data destroyed");
    await mongoose.disconnect();
    process.exit(0);
  }

  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Setting.deleteMany(), Banner.deleteMany()]);

  // Site settings (Islamic branding) + hero banners
  await Setting.create({
    key: "global",
    logoText: "Al-Tabarukat",
    announcements: [
      "✦ Authentic Tabarukat from Karbala, Najaf & Qom",
      "✦ FREE delivery on online payments",
      "✦ Worldwide delivery — WhatsApp us to order",
    ],
  });
  await Banner.insertMany(banners);

  await User.create({ name: "Admin", email: "admin@shopverse.com", password: "admin123", role: "admin" });
  await User.create({ name: "Demo Momin", email: "customer@shopverse.com", password: "customer123" });

  const catDocs = {};
  for (const c of categories) {
    catDocs[c.name] = await new Category(c).save();
  }

  let count = 0;
  for (const [catName, list] of Object.entries(productsByCat)) {
    for (const item of list) {
      const seed = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 28);
      await new Product({
        ...item,
        category: catDocs[catName]._id,
        images: [img(seed), img(seed + "-b"), img(seed + "-c"), img(seed + "-d")],
        countInStock: 15 + (item.price % 20),
        rating: Math.min(5, 4 + ((item.price % 10) / 10)),
        numReviews: 6 + (item.price % 50),
        featured: count % 3 === 0,
        sku: "AT-" + (1000 + count),
        tags: [catName, item.brand],
      }).save();
      count++;
    }
  }

  console.log(`✅ Seeded ${Object.keys(catDocs).length} categories & ${count} products (Al-Tabarukat)`);
  console.log("👤 Admin login:    admin@shopverse.com / admin123");
  console.log("👤 Customer login: customer@shopverse.com / customer123");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
