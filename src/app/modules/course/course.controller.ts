import cloudinary from "cloudinary";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { courseModel } from "./course.model";
import AppError from "../../errors/AppError";
import { Module } from "../module/module.model";
import mongoose, { Types } from "mongoose";
import { userModel } from "../user/user.model";

const uploadCourse = catchAsync(async (req, res) => {
  const { course, module } = req.body;
  console.log(module[0]);
  const session = await mongoose.startSession();
  session.startTransaction();

  const thumbnail = course.thumbnail;
  if (thumbnail) {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });

    course.thumbnail = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  try {
    const courseResult = await courseModel.create([course], { session });
    const modules = module.map((mod: any) => ({
      ...mod,
      courseId: courseResult[0]._id,
    }));

    const moduleResult = await Module.create(modules, { session });

    await session.commitTransaction();
    session.endSession();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Course created succesfully",
      data: { course: courseResult[0], module: moduleResult },
    });
  } catch (err: any) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, err.message);
  }
});

const getAllCourse = catchAsync(async (req, res) => {
  const course = await courseModel
    .find()
    .select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrive succesfully",
    data: course,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const courseId = req.params.id;
  const courseModule = await Module.find({
    courseId: new Types.ObjectId(courseId),
  });

  const course = await courseModel
    .findById(req.params.id)
    .select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrive succesfully",
    data: { course, courseModule },
  });
});

const getAllAdminCourses = catchAsync(async (req, res) => {
  const courses = await courseModel.find().sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Courses retrive succesfully",
    data: courses,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const course = await courseModel.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses delete succesfully",
    data: course,
  });
});

const getUserCourses = catchAsync(async (req, res) => {
  const id = req.user?._id;
  const isUserExist = await userModel.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const courseIds = isUserExist?.courses?.map((item) => item?.courseId);

  const courses = await courseModel.find({
    _id: {
      $in: courseIds,
    },
  });

  if (courses.length === 0) {
    throw new AppError(404, "No courses parched yet!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Courses retrive succesfully",
    data: courses,
  });
});

const getAllModuleofSingleCourse = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const courseModules = await Module.find({
    courseId: new Types.ObjectId(id),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses module retrive succesfully",
    data: courseModules,
  });
});

const getAccessVideoContent = catchAsync(async (req, res) => {
  const id = req?.params?.id;

  const courseModules = await Module.find({
    courseId: new Types.ObjectId(id),
  });

  if (!req?.query?.moduleNo || !req?.query?.videoNo) {
    throw new AppError(404, "Query perameter is required!");
  }

  const module = courseModules.find(
    (module) => module.moduleNo == parseInt(req?.query?.moduleNo! as string)
  );

  const video = module?.content?.find(
    (video) => video?.videoNo === parseInt(req.query.videoNo! as string)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course access content retrive succesfully",
    data: {
      videoUrl: video?.videoUrl,
      videoName: video?.videoName,
      videoNo: video?.videoNo,
      moduleNo: module?.moduleNo,
    },
  });
});

const getAllModule = catchAsync(async (req, res) => {
  const module = await Module.find();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Modules retrive succesfully",
    data: module,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const id = req.params?.id;
  const body = req.body;

  const isCourseExist = await courseModel.findById(id);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
  }

  if (body?.image) {
    if (isCourseExist?.thumbnail?.public_id) {
      await cloudinary.v2.uploader.destroy(isCourseExist?.thumbnail?.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(body?.image, {
      folder: "courses",
    });

    body.thumbnail = {
      public_id: myCloud?.public_id,
      url: myCloud?.secure_url,
    };
  }

  const course = await courseModel.findByIdAndUpdate(
    id,
    {
      $set: body,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course update succesfully",
    data: course,
  });
});

export const courseController = {
  getAllCourse,
  uploadCourse,
  getSingleCourse,
  getAllAdminCourses,
  deleteCourse,
  getUserCourses,
  getAllModuleofSingleCourse,
  getAccessVideoContent,
  getAllModule,
  updateCourse,
};
