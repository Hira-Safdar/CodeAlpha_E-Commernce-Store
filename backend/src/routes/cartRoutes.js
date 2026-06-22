import express from "express";
import { body } from "express-validator";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getCart);
router.post(
  "/add",
  [body("productId").isMongoId(), body("quantity").optional().isInt({ min: 1 })],
  validate,
  addToCart
);
router.put(
  "/update",
  [body("productId").isMongoId(), body("quantity").isInt({ min: 1 })],
  validate,
  updateCartItem
);
router.delete("/remove", [body("productId").optional().isMongoId()], validate, removeCartItem);

export default router;
