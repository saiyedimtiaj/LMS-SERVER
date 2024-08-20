import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { notificationModel } from "./notification.model";
import AppError from "../../errors/AppError";

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationModel.find().sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification retrive successfull!",
    data: notification,
  });
});

const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationModel.findByIdAndUpdate(
    req.params.id,
    { status: "read" },
    { new: true } // This option ensures that the updated document is returned
  );

  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  }

  const notifications = await notificationModel.find().sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification update successfull!",
    data: notifications,
  });
});

export const notificatonController = {
  getNotification,
  updateNotification,
};
