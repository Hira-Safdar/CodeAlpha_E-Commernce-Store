import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const authResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  },
  token: generateToken(user._id)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(authResponse(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
