import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const DELIVERY_FEE = 300;

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id }).populate("products.product");

  if (!cart || cart.products.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const orderProducts = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    const product = item.product;
    if (!product || product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product?.title || "a product"}`);
    }
    orderProducts.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: item.quantity
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    userId: req.user._id,
    products: orderProducts,
    totalAmount: totalAmount + DELIVERY_FEE,
    shippingAddress
  });

  await Promise.all(
    cart.products.map((item) =>
      Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
    )
  );

  cart.products = [];
  await cart.save();

  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const orders = await Order.find(query).sort({ createdAt: -1 }).populate("userId", "name email");
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.userId = req.user._id;

  const order = await Order.findOne(query).populate("userId", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus, paymentStatus: req.body.paymentStatus },
    { new: true, runValidators: true }
  );
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});
