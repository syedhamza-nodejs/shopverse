import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/products
// supports: ?keyword= &category=<slug> &min= &max= &sort= &page= &limit= &featured=
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Number(req.query.limit) || 12);
  const filter = {};

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }
  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category }).select("_id");
    if (cat) filter.category = cat._id;
  }
  if (req.query.featured === "true") filter.featured = true;
  if (req.query.brand) {
    const brands = req.query.brand.split(",").map((b) => b.trim()).filter(Boolean);
    if (brands.length) filter.brand = { $in: brands };
  }
  if (req.query.min || req.query.max) {
    filter.price = {};
    if (req.query.min) filter.price.$gte = Number(req.query.min);
    if (req.query.max) filter.price.$lte = Number(req.query.max);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products: items,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @route GET /api/products/filters?category=<slug>
// returns available brands + price range for building filter UI
export const getFilterMeta = asyncHandler(async (req, res) => {
  const match = {};
  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category }).select("_id");
    if (cat) match.category = cat._id;
  }
  const [brands, range] = await Promise.all([
    Product.distinct("brand", match),
    Product.aggregate([
      { $match: match },
      { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
    ]),
  ]);
  res.json({
    brands: brands.filter(Boolean).sort(),
    minPrice: range[0]?.min || 0,
    maxPrice: range[0]?.max || 0,
  });
});

// @route GET /api/products/featured
export const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true })
    .populate("category", "name slug")
    .limit(8)
    .lean();
  res.json(products);
});

// @route GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .lean();
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @route PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, req.body);
  res.json(await product.save());
});

// @route DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product removed" });
});

// @route POST /api/products/:id/reviews  (auth)
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const already = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (already) {
    res.status(400);
    throw new Error("You already reviewed this product");
  }
  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: "Review added" });
});
