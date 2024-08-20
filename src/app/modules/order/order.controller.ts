import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userModel } from "../user/user.model";
import mongoose, { Types } from "mongoose";
import { orderModel } from "./order.model";
import { courseModel } from "../course/course.model";
import path from "path";
import sendEmail from "../../utils/sendMails";
import { notificationModel } from "../notification/notification.model";
import AppError from "../../errors/AppError";
import ejs from "ejs";
import config from "../../config";
const stripe = require("stripe")(config.stripe_secret_key);

const createOrder = catchAsync(async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    const { courseId, payment_info } = req.body;
    const user = await userModel.findById(req.user?._id).session(session); // Include session in all queries

    await userModel.findByIdAndUpdate(
      user?._id,
      {
        $push: {
          courses: {
            courseId,
            videoNo: 1,
            moduleNo: 1,
          },
        },
      },
      { session }
    );

    const paymentData = {
      courseId,
      paymentId: payment_info?.id,
      amount: payment_info?.amount,
      userId: user?._id,
    };

    const order = await orderModel.create([paymentData], { session });

    const course = await courseModel.findById(courseId).session(session);
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
    }

    const mailData = {
      order: {
        _id: (course?._id as any).toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    if (user) {
      try {
        await sendEmail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      } catch (err: any) {
        throw new AppError(400, "Failed to send confirmation email");
      }
    }

    await user?.save({ session });
    await notificationModel.create(
      [
        {
          user: user?._id,
          title: "New Order",
          message: `You have a new order from ${course?.name}`,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment successfull!",
      data: order,
    });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
  }
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderModel
    .find()
    .sort({ createdAt: -1 })
    .populate("userId")
    .populate("courseId");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrive successfully!",
    data: orders,
  });
});

const newPayment = catchAsync(async (req, res) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "USD",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe client secret retrive successfully!",
    data: myPayment.client_secret,
  });
});

const getUsersOrders = catchAsync(async (req, res) => {
  const user = req.user;
  const orders = await orderModel
    .find({
      userId: new Types.ObjectId(user._id),
    })
    .populate("courseId");

  console.log(orders);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrive successfull!",
    data: orders,
  });
});

export const orderController = {
  createOrder,
  getAllOrders,
  newPayment,
  getUsersOrders,
};
