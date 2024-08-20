import { Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  thumbnail: { public_id: string; url: string };
  tags: string;
  demoUrl: string;
  language: string;
  title: string;
  category: string;
  level: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  ratings?: number;
  purchased?: number;
}
