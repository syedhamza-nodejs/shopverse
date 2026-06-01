import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, default: "Generic" },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 }, // original price for discount display
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    highlights: [{ type: String }], // key feature bullet points
    specs: [{ key: String, value: String }], // technical specifications
    sku: String,
    warranty: { type: String, default: "" },
    badges: [{ type: String }], // e.g. "Authentic", "Imported", "Best Seller"
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug =
      slugify(this.name, { lower: true, strict: true }) +
      "-" +
      Math.random().toString(36).slice(2, 7);
  }
  next();
});

export default mongoose.model("Product", productSchema);
