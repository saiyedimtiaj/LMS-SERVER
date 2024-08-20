import { Types } from "mongoose";

export type TContent = {
  videoNo: number;
  videoName: string;
  videoLength: number;
  videoUrl: string;
};

export type TModule = {
  moduleNo: number;
  moduleName: string;
  courseId: Types.ObjectId;
  content: TContent[];
};
