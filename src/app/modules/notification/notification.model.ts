import { Model, Schema, model } from "mongoose";
import { INotofication } from "./notification.interface";

const notificationSchema = new Schema<INotofication>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Unread",
    },
  },
  { timestamps: true }
);

export const notificationModel: Model<INotofication> = model(
  "notification",
  notificationSchema
);
