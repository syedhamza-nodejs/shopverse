import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/stats  (admin) — dashboard summary
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [orders, products, users, revenueAgg] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const recentOrders = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.json({
    orders,
    products,
    customers: users,
    revenue: revenueAgg[0]?.total || 0,
    recentOrders,
  });
});
