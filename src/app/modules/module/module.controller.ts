import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { courseModel } from "../course/course.model";
import AppError from "../../errors/AppError";
import { Module } from "./module.model";
import { Types } from "mongoose";

const createModule = catchAsync(async (req, res) => {
  const id = req.body?.courseId;
  const isCourseExist = await courseModel.findById(id);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
  }
  const module = await Module.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Module create sucessfully!",
    data: module,
  });
});

const deleteModule = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await Module.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Module create sucessfully!",
    data: result,
  });
});

const getCourseModule = catchAsync(async (req, res) => {
  const id = req.params?.id;
  const module = await Module.find({ courseId: new Types.ObjectId(id) });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Module retrive sucessfully!",
    data: module,
  });
});

export const moduleController = {
  createModule,
  deleteModule,
  getCourseModule,
};
