import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  paymentId: string;
  amount: number;
}
