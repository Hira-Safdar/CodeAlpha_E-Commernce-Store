import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort = "newest", page = 1, limit = 12 } = req.query;
  const query = {};

  if (search) query.$text = { $search: search };
  if (category && category !== "all") query.category = category;

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { "ratings.average": -1 }
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total, categories] = await Promise.all([
    Product.find(query).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
    Product.distinct("category")
  ]);

  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
    categories
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ message: "Product deleted" });
});
