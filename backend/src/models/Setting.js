import mongoose from "mongoose";

// Singleton document holding global site settings (admin-editable)
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    logoText: { type: String, default: "ShopVerse" },
    announcements: {
      type: [String],
      default: [
        "✦ Enjoy FREE delivery on online payments",
        "✦ Get 10% off on orders over Rs 15,000",
        "✦ Worldwide delivery available — WhatsApp us to order",
      ],
    },
    whatsapp: { type: String, default: "923000000000" },
    phone: { type: String, default: "0300-0000000" },
    email: { type: String, default: "support@shopverse.com" },
    hours: { type: String, default: "Mon–Sat · 9am–8pm" },
    freeShippingThreshold: { type: Number, default: 10000 }, // in base currency (PKR)
    shippingFlat: { type: Number, default: 250 },
    baseCurrency: { type: String, default: "PKR" },
    currencies: {
      type: [
        {
          code: String,
          symbol: String,
          rate: Number, // 1 base unit = rate of this currency
          _id: false,
        },
      ],
      default: [
        { code: "PKR", symbol: "Rs", rate: 1 },
        { code: "USD", symbol: "$", rate: 0.0036 },
        { code: "AED", symbol: "د.إ", rate: 0.013 },
        { code: "GBP", symbol: "£", rate: 0.0028 },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
