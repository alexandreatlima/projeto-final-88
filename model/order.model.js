import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: new Date(Date.now()) },
  consumer: { type: Types.ObjectId, ref: "User" },
  product: { type: Types.ObjectId, ref: "Product" },
  status: {
    type: String,
    enum: [
      "Recebido",
      "Pagamento confirmado",
      "NF Emitida",
      "Enviado",
      "Entregue",
      "Cancelado",
    ],
    default: "Recebido",
  },
});

export const OrderModel = model("Order", orderSchema);
