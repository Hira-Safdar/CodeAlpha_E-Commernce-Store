import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

const products = [
  {
    title: "Nova Wireless Headphones",
    description: "Comfortable over-ear headphones with deep bass and 40-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 129.99,
    stock: 24,
    ratings: { average: 4.7, count: 86 }
  },
  {
    title: "Urban Commuter Backpack",
    description: "Water-resistant everyday backpack with laptop sleeve and quick-access pockets.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 74.5,
    stock: 31,
    ratings: { average: 4.5, count: 49 }
  },
  {
    title: "Minimal Desk Lamp",
    description: "Dimmable LED lamp with adjustable arm and warm/cool lighting modes.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 42,
    stock: 18,
    ratings: { average: 4.3, count: 33 }
  },
  {
    title: "Smart Fitness Watch",
    description: "Track workouts, sleep, notifications, and heart rate from a crisp AMOLED screen.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 189,
    stock: 15,
    ratings: { average: 4.6, count: 112 }
  }
];

const run = async () => {
  await connectDB();
  await Product.deleteMany();
  await User.deleteMany();
  await Product.insertMany(products);
  await User.create({
    name: "Admin User",
    email: "admin@codealpha.com",
    password: "admin123",
    role: "admin"
  });
  console.log("Seeded products and admin user");
  process.exit();
};

run();
