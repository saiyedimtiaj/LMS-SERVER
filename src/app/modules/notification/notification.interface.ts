import { Document } from "mongoose";

export interface INotofication extends Document {
  title: string;
  message: string;
  status: string;
  userId: string;
}
