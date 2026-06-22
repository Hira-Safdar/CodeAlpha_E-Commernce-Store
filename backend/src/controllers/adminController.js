import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalProducts, totalOrders, revenueData, lowStock] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalAmount" } } }]),
    Product.find({ stock: { $lte: 5 } }).select("title stock").limit(6)
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    revenue: revenueData[0]?.revenue || 0,
    lowStock
  });
});
