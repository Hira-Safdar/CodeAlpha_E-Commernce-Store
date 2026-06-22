import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateCart = (query) =>
  query.populate("products.product", "title image price stock category ratings");

export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(Cart.findOne({ userId: req.user._id }));
  res.json(cart || { userId: req.user._id, products: [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $setOnInsert: { userId: req.user._id } },
    { upsert: true, new: true }
  );

  const item = cart.products.find((entry) => entry.product.toString() === productId);
  if (item) item.quantity = Math.min(item.quantity + Number(quantity), product.stock);
  else cart.products.push({ product: productId, quantity });

  await cart.save();
  res.status(201).json(await populateCart(Cart.findById(cart._id)));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.products.find((entry) => entry.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  item.quantity = Math.min(Number(quantity), product.stock);
  await cart.save();
  res.json(await populateCart(Cart.findById(cart._id)));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const productId = req.body.productId || req.query.productId;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ userId: req.user._id, products: [] });

  cart.products = cart.products.filter((entry) => entry.product.toString() !== productId);
  await cart.save();
  res.json(await populateCart(Cart.findById(cart._id)));
});
