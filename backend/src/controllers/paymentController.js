import Stripe from "stripe";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("xxx")) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// @route POST /api/payments/create-intent  (auth)
// body: { orderId }
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  const order = await Order.findById(req.body.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!stripe) {
    // Demo mode: no real Stripe keys configured
    res.status(503).json({
      message: "Stripe not configured. Add STRIPE_SECRET_KEY in backend/.env.",
      demo: true,
    });
    return;
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // PKR paisa
    currency: "pkr",
    metadata: { orderId: order._id.toString() },
  });
  res.json({ clientSecret: intent.client_secret });
});

// @route POST /api/payments/:orderId/mark-paid  (auth) — used by COD confirm / demo
export const markPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = { id: req.body.paymentId || "manual", status: "paid" };
  order.status = "processing";
  res.json(await order.save());
});
