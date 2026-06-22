import express from "express";
import { body } from "express-validator";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
router.use(protect);

router.post(
  "/",
  [
    body("shippingAddress.fullName").trim().notEmpty(),
    body("shippingAddress.phone").trim().notEmpty(),
    body("shippingAddress.address").trim().notEmpty(),
    body("shippingAddress.city").trim().notEmpty(),
    body("shippingAddress.postalCode").trim().notEmpty(),
    body("shippingAddress.country").trim().notEmpty()
  ],
  validate,
  createOrder
);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

export default router;
