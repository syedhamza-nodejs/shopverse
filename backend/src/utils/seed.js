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
  { name: "Electronics", featured: true, image: img("cat-electronics"), description: "Phones, laptops, audio & gadgets" },
  { name: "Fashion", featured: true, image: img("cat-fashion"), description: "Clothing, shoes & accessories" },
  { name: "Home & Kitchen", featured: true, image: img("cat-home"), description: "Appliances & home essentials" },
  { name: "Beauty", featured: false, image: img("cat-beauty"), description: "Skincare, makeup & care" },
  { name: "Sports", featured: false, image: img("cat-sports"), description: "Fitness & outdoor gear" },
  { name: "Books", featured: false, image: img("cat-books"), description: "Bestsellers & more" },
];

// p(name, brand, price, compareAt, desc, highlights[], specs{}, badges[])
const p = (name, brand, price, compareAtPrice, description, highlights = [], specs = {}, badges = []) => ({
  name, brand, price, compareAtPrice, description, highlights,
  specs: Object.entries(specs).map(([key, value]) => ({ key, value })),
  badges,
});

const productsByCat = {
  Electronics: [
    p("Wireless Noise-Cancelling Headphones", "Sony", 24999, 29999,
      "Experience studio-grade sound with industry-leading active noise cancellation. These over-ear headphones adapt to your environment, deliver 30 hours of battery life, and fold flat for travel. Premium memory-foam ear cushions ensure all-day comfort.",
      ["Industry-leading active noise cancellation", "30-hour battery, fast USB-C charging", "Adaptive sound control & touch gestures", "Premium memory-foam cushions"],
      { Connectivity: "Bluetooth 5.2", "Battery Life": "30 hours", Weight: "254 g", Charging: "USB-C (10 min = 5 hrs)" },
      ["Best Seller", "1-Year Warranty"]),
    p("Smartphone Pro 5G 128GB", "Galaxy", 89999, 99999,
      "A flagship 5G smartphone with a brilliant 6.7\" AMOLED 120Hz display, pro-grade triple camera system, and all-day battery. Powered by the latest octa-core chipset for effortless multitasking and gaming.",
      ["6.7\" AMOLED 120Hz display", "Pro triple camera (50MP main)", "5000mAh battery, 45W fast charge", "5G + Wi-Fi 6E"],
      { Display: "6.7\" AMOLED 120Hz", RAM: "8 GB", Storage: "128 GB", Battery: "5000 mAh", Camera: "50MP + 12MP + 10MP" },
      ["New", "Imported"]),
    p("14\" Ultrabook Laptop i7", "Lenovo", 159999, 179999,
      "Thin, light and powerful. This ultrabook packs an 11th-gen Intel Core i7, 16GB RAM and a fast 512GB SSD into an aluminium chassis under 1.4kg, with a vivid full-HD display and all-day battery.",
      ["Intel Core i7, 16GB RAM, 512GB SSD", "Under 1.4kg aluminium body", "14\" Full-HD anti-glare display", "Backlit keyboard + fingerprint login"],
      { CPU: "Intel Core i7-1165G7", RAM: "16 GB DDR4", Storage: "512 GB NVMe SSD", Display: "14\" FHD IPS", Weight: "1.38 kg" },
      ["Free Shipping", "2-Year Warranty"]),
    p("Smartwatch Series 8", "Apple", 64999, 0,
      "Stay connected and track your health with an always-on Retina display, advanced heart-rate and ECG sensors, built-in GPS, and water resistance. Seamlessly pairs with your phone for calls, messages and workouts.",
      ["Always-on Retina display", "Heart-rate, ECG & blood-oxygen sensors", "Built-in GPS + 50m water resistance", "18-hour battery"],
      { Display: "Always-on Retina", "Water Resistance": "50 m", GPS: "Built-in", Battery: "18 hours" },
      ["Best Seller"]),
    p("Bluetooth Speaker Waterproof", "JBL", 8999, 11999,
      "Take the party anywhere with punchy bass, crystal-clear sound and IPX7 waterproofing. 12 hours of playtime and a rugged fabric finish make it the perfect outdoor companion.",
      ["Bold JBL Pro Sound with deep bass", "IPX7 fully waterproof", "12-hour playtime", "Wireless stereo pairing"],
      { "Battery Life": "12 hours", "Water Rating": "IPX7", Connectivity: "Bluetooth 5.1", Weight: "560 g" },
      ["Imported"]),
    p("4K Action Camera", "GoPro", 54999, 0,
      "Capture every adventure in stunning 4K60 with HyperSmooth stabilization, a rugged waterproof body and voice control. Ultra-wide lens and slow-motion modes built in.",
      ["4K60 video + 20MP photos", "HyperSmooth stabilization", "Waterproof to 10m without case", "Voice control & live streaming"],
      { Video: "4K60", Photo: "20 MP", Waterproof: "10 m", Stabilization: "HyperSmooth 4.0" },
      ["New", "Adventure Ready"]),
    p("True Wireless Earbuds", "Soundcore", 11999, 14999,
      "Compact earbuds with rich, balanced audio, active noise cancellation and a pocketable charging case delivering 32 hours total. Sweat-resistant for workouts.",
      ["Active noise cancellation", "32 hours total with case", "IPX5 sweat resistant", "Touch controls + app EQ"],
      { "Total Battery": "32 hours", "Water Rating": "IPX5", Connectivity: "Bluetooth 5.3" },
      ["Best Seller"]),
  ],
  Fashion: [
    p("Men's Slim Fit Casual Shirt", "Outfitters", 2499, 3499,
      "A versatile slim-fit shirt cut from breathable 100% cotton. Tailored for a sharp silhouette, it transitions effortlessly from office to evening. Wrinkle-resistant and easy to care for.",
      ["100% breathable cotton", "Slim tailored fit", "Wrinkle-resistant fabric", "Available in multiple colours"],
      { Fabric: "100% Cotton", Fit: "Slim", Care: "Machine washable" },
      ["Best Seller"]),
    p("Women's Embroidered Kurti", "Khaadi", 3999, 4999,
      "An elegant lawn kurti featuring intricate hand-guided embroidery and a flattering A-line cut. Lightweight and breathable — perfect for everyday elegance or festive occasions.",
      ["Premium lawn fabric", "Intricate embroidery detail", "Flattering A-line cut", "Breathable & lightweight"],
      { Fabric: "Lawn", Work: "Embroidered", Length: "Knee length" },
      ["New", "Imported"]),
    p("Running Sneakers", "Nike", 11999, 14999,
      "Lightweight running shoes engineered with responsive cushioning and a breathable knit upper. The durable rubber outsole grips every surface for confident daily training.",
      ["Responsive foam cushioning", "Breathable knit upper", "Durable grip outsole", "Lightweight at 280g"],
      { Upper: "Engineered knit", Sole: "Rubber", Weight: "280 g", Use: "Running / Training" },
      ["Best Seller"]),
    p("Genuine Leather Wallet", "Hub", 1999, 2799,
      "A slim bi-fold wallet handcrafted from full-grain genuine leather, with six card slots, two note compartments and RFID-blocking protection. Ages beautifully with use.",
      ["Full-grain genuine leather", "RFID-blocking protection", "6 card slots + 2 note pockets", "Slim, pocket-friendly design"],
      { Material: "Genuine Leather", Slots: "6 cards", Protection: "RFID blocking" },
      ["Handcrafted"]),
    p("Classic Aviator Sunglasses", "RayBan", 6999, 8999,
      "Timeless aviator sunglasses with polarized, UV400-protected lenses and a lightweight metal frame. Reduces glare for crystal-clear vision in bright sun.",
      ["Polarized UV400 lenses", "Lightweight metal frame", "Anti-glare coating", "Includes case & cloth"],
      { Lens: "Polarized UV400", Frame: "Metal", Style: "Aviator" },
      ["Imported"]),
    p("Analog Wrist Watch", "Fossil", 14999, 18999,
      "A refined analog timepiece with a stainless-steel case, genuine leather strap and water resistance. Minimalist dial design for a versatile, premium look.",
      ["Stainless-steel case", "Genuine leather strap", "30m water resistance", "Japanese quartz movement"],
      { Case: "Stainless steel", Strap: "Leather", "Water Resistance": "30 m", Movement: "Quartz" },
      ["New"]),
  ],
  "Home & Kitchen": [
    p("Air Fryer 5L Digital", "Philips", 19999, 24999,
      "Enjoy your favourite fried foods with up to 90% less oil. This 5L digital air fryer features 7 one-touch presets, rapid air technology and a dishwasher-safe basket for easy cleanup.",
      ["Up to 90% less oil", "5L family-size capacity", "7 one-touch presets", "Dishwasher-safe basket"],
      { Capacity: "5 L", Power: "1500 W", Presets: "7", Cleanup: "Dishwasher safe" },
      ["Best Seller", "1-Year Warranty"]),
    p("Non-Stick Cookware Set (7pc)", "Prestige", 8999, 12999,
      "A complete 7-piece non-stick cookware set with durable triple-layer coating, ergonomic stay-cool handles and even heat distribution. Compatible with all stovetops.",
      ["Triple-layer non-stick coating", "Stay-cool ergonomic handles", "Even heat distribution", "All-stovetop compatible"],
      { Pieces: "7", Coating: "Triple-layer non-stick", Compatible: "All stovetops" },
      ["Value Pack"]),
    p("Robot Vacuum Cleaner", "Xiaomi", 39999, 0,
      "Smart laser-navigation robot vacuum that maps your home and cleans methodically. Control it from your phone, set no-go zones, and let it recharge automatically.",
      ["Precise laser (LDS) navigation", "App control + scheduling", "Strong 2700Pa suction", "Auto-recharge & resume"],
      { Suction: "2700 Pa", Navigation: "Laser LDS", Battery: "5200 mAh", Control: "App + voice" },
      ["New", "Smart Home"]),
    p("Electric Kettle 1.8L", "Anex", 3499, 4499,
      "Boil water in minutes with this 1.8L stainless-steel kettle. Auto shut-off, boil-dry protection and a 360° swivel base make daily use safe and effortless.",
      ["Fast 1.8L stainless-steel body", "Auto shut-off & boil-dry protection", "360° cordless swivel base", "Concealed heating element"],
      { Capacity: "1.8 L", Power: "1500 W", Body: "Stainless steel" },
      ["Best Seller"]),
    p("8-Piece Knife Block Set", "Victorinox", 13999, 16999,
      "Precision-forged stainless-steel knives with ergonomic handles, presented in a sleek wooden block. Razor-sharp edges for effortless slicing, dicing and carving.",
      ["High-carbon stainless steel", "Ergonomic non-slip handles", "Includes sharpener & block", "Razor-sharp precision edges"],
      { Pieces: "8", Material: "High-carbon steel", Includes: "Wooden block + sharpener" },
      ["Imported", "Chef's Choice"]),
  ],
  Beauty: [
    p("Vitamin C Face Serum", "The Ordinary", 2999, 0,
      "A potent brightening serum with 15% Vitamin C and hyaluronic acid that visibly evens skin tone, fades dark spots and boosts radiance. Lightweight, fast-absorbing and suitable for daily use.",
      ["15% Vitamin C + hyaluronic acid", "Brightens & evens skin tone", "Fades dark spots over time", "Lightweight, fast-absorbing"],
      { Volume: "30 ml", "Key Actives": "Vitamin C 15%", "Skin Type": "All types" },
      ["Best Seller", "Cruelty-Free"]),
    p("Matte Lipstick Set (5 Shades)", "Maybelline", 3499, 4499,
      "A set of five long-wearing matte lipsticks in versatile everyday-to-evening shades. Creamy formula glides on smoothly and stays put for hours without drying.",
      ["5 versatile matte shades", "Long-wearing, transfer-resistant", "Creamy non-drying formula", "Highly pigmented colour"],
      { Shades: "5", Finish: "Matte", Wear: "Up to 8 hours" },
      ["Value Pack"]),
    p("Ionic Hair Dryer", "Panasonic", 6999, 8499,
      "Dry and style faster with ionic technology that reduces frizz and adds shine. Lightweight design, multiple heat settings and a cool-shot button for lasting styles.",
      ["Ionic frizz-reducing technology", "3 heat + 2 speed settings", "Cool-shot button", "Lightweight ergonomic grip"],
      { Power: "1800 W", Technology: "Ionic", Settings: "3 heat / 2 speed" },
      ["New"]),
    p("Luxury Eau de Parfum 100ml", "Versace", 18999, 22999,
      "An elegant long-lasting fragrance with notes of bergamot, jasmine and warm amber. Sophisticated and versatile — crafted for those who appreciate refined scent.",
      ["Long-lasting 100ml bottle", "Notes: bergamot, jasmine, amber", "Elegant unisex profile", "Premium gift packaging"],
      { Volume: "100 ml", Family: "Floral Amber", Longevity: "8+ hours" },
      ["Imported", "Luxury"]),
  ],
  Sports: [
    p("Anti-Slip Yoga Mat", "Decathlon", 2499, 0,
      "A cushioned 6mm yoga mat with a textured anti-slip surface for stability in every pose. Lightweight, eco-friendly TPE material that's easy to roll and carry.",
      ["6mm cushioned support", "Textured anti-slip surface", "Eco-friendly TPE material", "Includes carry strap"],
      { Thickness: "6 mm", Material: "Eco TPE", Size: "183 × 61 cm" },
      ["Eco-Friendly"]),
    p("Adjustable Dumbbell 20kg", "FitPro", 14999, 17999,
      "Replace a whole rack with one space-saving adjustable dumbbell. Quick-select weight from 2.5kg to 20kg, with a secure locking mechanism and durable steel plates.",
      ["Adjusts 2.5kg – 20kg", "Space-saving design", "Secure quick-lock dial", "Durable coated steel plates"],
      { "Weight Range": "2.5–20 kg", Type: "Adjustable", Material: "Coated steel" },
      ["Best Seller"]),
    p("Match Football Size 5", "Adidas", 3999, 0,
      "A match-quality machine-stitched football with a durable TPU casing and butyl bladder for excellent air retention and a true, consistent flight.",
      ["Match-quality construction", "Durable TPU outer casing", "Butyl bladder air retention", "FIFA-standard size 5"],
      { Size: "5", Construction: "Machine-stitched", Use: "Match / Training" },
      ["Imported"]),
    p("Insulated Steel Water Bottle 1L", "Milton", 1999, 2599,
      "Double-wall vacuum-insulated bottle keeps drinks cold for 24 hours or hot for 12. Leak-proof, BPA-free and built from rust-proof stainless steel.",
      ["24h cold / 12h hot", "Leak-proof BPA-free lid", "Rust-proof stainless steel", "1L on-the-go capacity"],
      { Capacity: "1 L", Insulation: "Double-wall vacuum", Material: "Stainless steel" },
      ["Eco-Friendly"]),
  ],
  Books: [
    p("Atomic Habits", "James Clear", 1799, 2200,
      "The #1 bestseller on building good habits and breaking bad ones. James Clear reveals practical, science-backed strategies to make tiny changes that deliver remarkable results.",
      ["#1 international bestseller", "Practical, science-backed methods", "Build systems, not just goals", "320 pages, paperback"],
      { Author: "James Clear", Pages: "320", Format: "Paperback", Language: "English" },
      ["Best Seller"]),
    p("The Psychology of Money", "Morgan Housel", 1599, 0,
      "Timeless lessons on wealth, greed and happiness. Through 19 short stories, Morgan Housel explores the strange ways people think about money and how to make better financial decisions.",
      ["19 insightful short stories", "Timeless money lessons", "Easy, engaging read", "256 pages, paperback"],
      { Author: "Morgan Housel", Pages: "256", Format: "Paperback" },
      ["Best Seller"]),
    p("Deep Work", "Cal Newport", 1699, 1999,
      "Rules for focused success in a distracted world. Cal Newport makes the case for deep, undistracted work and provides a rigorous training regimen to master it.",
      ["Master focused, distraction-free work", "Actionable productivity rules", "Backed by research & case studies", "304 pages"],
      { Author: "Cal Newport", Pages: "304", Format: "Paperback" },
      ["New"]),
    p("Ikigai: The Japanese Secret", "Héctor García", 1499, 1899,
      "Discover the Japanese concept of ikigai — your reason for being. A warm, practical guide to finding purpose, joy and longevity in everyday life.",
      ["The Japanese secret to a long life", "Practical purpose-finding guide", "Inspiring real-life examples", "208 pages"],
      { Author: "Héctor García", Pages: "208", Format: "Hardcover" },
      ["Best Seller"]),
  ],
};

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Setting.deleteMany(), Banner.deleteMany()]);
    console.log("🗑️  All data destroyed");
    await mongoose.disconnect();
    process.exit(0);
  }

  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Setting.deleteMany(), Banner.deleteMany()]);

  // Site settings (singleton) + hero banners
  await Setting.create({ key: "global" });
  await Banner.insertMany([
    { eyebrow: "The Tech Edit", title: "Premium Electronics, Curated for You", subtitle: "Flagship phones, audio & laptops — up to 40% off.", image: img("hero-electronics-x") , ctaText: "Shop Electronics", ctaLink: "/category/electronics", order: 1 },
    { eyebrow: "Signature Style", title: "Fashion that Defines You", subtitle: "Handpicked apparel, footwear & accessories.", image: img("hero-fashion-x"), ctaText: "Explore Fashion", ctaLink: "/category/fashion", order: 2 },
    { eyebrow: "Elevate Your Space", title: "Home & Living Essentials", subtitle: "Smart appliances and refined home décor.", image: img("hero-home-x"), ctaText: "Shop Home", ctaLink: "/category/home-kitchen", order: 3 },
  ]);

  await User.create({ name: "Admin", email: "admin@shopverse.com", password: "admin123", role: "admin" });
  await User.create({ name: "Demo Customer", email: "customer@shopverse.com", password: "customer123" });

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
        numReviews: 8 + (item.price % 60),
        featured: count % 3 === 0,
        sku: "SV-" + (1000 + count),
        warranty: item.badges.find((b) => /Warranty/i.test(b)) || "",
        tags: [catName, item.brand],
      }).save();
      count++;
    }
  }

  console.log(`✅ Seeded ${Object.keys(catDocs).length} categories & ${count} products`);
  console.log("👤 Admin login:    admin@shopverse.com / admin123");
  console.log("👤 Customer login: customer@shopverse.com / customer123");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
