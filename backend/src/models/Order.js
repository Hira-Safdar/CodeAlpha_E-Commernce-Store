import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [orderProductSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
