import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
  });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});
