import { model, Schema, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  orders: [{ type: Types.ObjectId, ref: "Order" }],
  product: [{ type: Types.ObjectId, ref: "Product" }],
});

export const UserModel = model("User", userSchema);
