import { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  tag: { type: String, enum: ["Tec", "Home", "Phone"] },
  stockQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date(Date.now()) },
  creator: { type: Types.ObjectId, ref: "User" },
  orders: [{ type: Types.ObjectId, ref: "Order" }],
});

export const ProductModel = model("Product", productSchema);
