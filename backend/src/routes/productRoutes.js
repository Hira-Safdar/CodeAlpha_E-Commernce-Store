import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

const productValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("image").isURL().withMessage("Image must be a valid URL"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("stock").isInt({ min: 0 }).withMessage("Stock cannot be negative")
];

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, productValidation, validate, createProduct);
router.put("/:id", protect, admin, productValidation, validate, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
