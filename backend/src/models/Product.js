import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    ratings: { type: ratingSchema, default: () => ({ average: 0, count: 0 }) }
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
