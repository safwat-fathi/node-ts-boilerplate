import { Schema } from "mongoose";
import { Order } from "types/db";

export const OrderSchema = new Schema<Order>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  total: { type: Number, required: true },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          _id: false,
        },
        quantity: Number,
        _id: false,
      },
    ],
    required: true,
    validate: (val: { product: Schema.Types.ObjectId; quantity: number }[]) =>
      Array.isArray(val) && val.length > 0,
  },
  status: { type: String, required: true },
  address: { type: String, required: true },
  delivery: { type: Date, default: Date.now, required: true },
});
