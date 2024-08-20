import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  password: string;
  avater: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: {
    courseId: Types.ObjectId;
    videoNo: number;
    moduleNo: number;
  }[];
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

export type IRegestationBody = {
  name: string;
  email: string;
  password: string;
  avater?: string;
};
