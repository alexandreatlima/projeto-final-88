import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: new Date(Date.now()) },
  consumer: { type: Types.ObjectId, ref: "User" },
  products: [{ type: Types.ObjectId, ref: "Product" }],
});

export const OrderModel = model("Order", orderSchema);
