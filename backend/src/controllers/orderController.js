import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SHIPPING_FLAT = 250; // PKR
const TAX_RATE = 0.0; // adjust if needed

// @route POST /api/orders  (auth)
// body: { items:[{product, qty}], shippingAddress, paymentMethod }
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items?.length) {
    res.status(400);
    throw new Error("No order items");
  }

  // Re-price from DB (never trust client prices)
  const detailed = [];
  let itemsPrice = 0;
  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${it.product}`);
    }
    if (product.countInStock < it.qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }
    itemsPrice += product.price * it.qty;
    detailed.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      qty: it.qty,
    });
  }

  const shippingPrice = itemsPrice > 10000 ? 0 : SHIPPING_FLAT;
  const taxPrice = Math.round(itemsPrice * TAX_RATE);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: detailed,
    shippingAddress,
    paymentMethod: paymentMethod || "cod",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // decrement stock
  for (const it of detailed) {
    await Product.updateOne(
      { _id: it.product },
      { $inc: { countInStock: -it.qty } }
    );
  }

  res.status(201).json(order);
});

// @route GET /api/orders/mine  (auth)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json(orders);
});

// @route GET /api/orders/:id  (auth/owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }
  res.json(order);
});

// @route GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();
  res.json(orders);
});

// @route PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = req.body.status || order.status;
  if (order.status === "delivered") order.deliveredAt = new Date();
  res.json(await order.save());
});
