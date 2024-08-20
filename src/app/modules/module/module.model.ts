import { Schema, model } from "mongoose";
import { TContent, TModule } from "./module.interface";

const ContentSchema = new Schema<TContent>({
  videoName: { type: String, required: true },
  videoLength: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  videoNo: { type: Number, required: true },
});

const modultSchema = new Schema<TModule>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: [true, "Course id is required"],
    ref: "course",
  },
  moduleName: {
    type: String,
    required: true,
  },
  moduleNo: {
    type: Number,
    required: true,
  },
  content: [ContentSchema],
});

export const Module = model<TModule>("Module", modultSchema);
