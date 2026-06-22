import express from "express";
import { body } from "express-validator";
import { getUsers, updateProfile, updateUserRole } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("email").optional().isEmail().normalizeEmail(),
    body("password").optional().isLength({ min: 6 })
  ],
  validate,
  updateProfile
);
router.get("/", protect, admin, getUsers);
router.put("/:id/role", protect, admin, [body("role").isIn(["user", "admin"])], validate, updateUserRole);

export default router;
