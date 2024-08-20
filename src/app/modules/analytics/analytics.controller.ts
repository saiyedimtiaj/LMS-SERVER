import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userModel } from "../user/user.model";
import { generateLast12MonthData } from "../../utils/generateLast12MonthData";
import { courseModel } from "../course/course.model";
import { orderModel } from "../order/order.model";

const getUserAnylatics = catchAsync(async (req, res) => {
  const users = await generateLast12MonthData(userModel);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User analytics retrive successfully!",
    data: users,
  });
});

const getCourseAnylatics = catchAsync(async (req, res) => {
  const course = await generateLast12MonthData(courseModel);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course analytics retrive successfully!",
    data: course,
  });
});

const getOrderAnylatics = catchAsync(async (req, res) => {
  const order = await generateLast12MonthData(orderModel);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order analytics retrive successfully!",
    data: order,
  });
});

const getDashboardData = catchAsync(async (req, res) => {
  const orders = await orderModel.find();
  const revenue = orders.reduce((total, order) => total + order.amount, 0);
  const users = await userModel.estimatedDocumentCount();
  const subscription = await orderModel.estimatedDocumentCount();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data retrived sucessfully!",
    data: {
      revenue,
      users,
      subscription,
    },
  });
});

export const analyticsController = {
  getUserAnylatics,
  getCourseAnylatics,
  getOrderAnylatics,
  getDashboardData,
};
