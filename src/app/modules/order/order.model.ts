import { Model, Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchems = new Schema<IOrder>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const orderModel: Model<IOrder> = model("Order", orderSchems);
