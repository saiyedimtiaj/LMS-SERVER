import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendEmail from "../../utils/sendMails";
import sendResponse from "../../utils/sendResponse";
import { IRegestationBody, IUser } from "./user.interface";
import { userModel } from "./user.model";
import { createActivationToken } from "../../utils/createActivationToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { sendToken } from "../../utils/jwt";
import cloudinary from "cloudinary";
import { jwtDecode } from "jwt-decode";

const registationUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, "Email already exists");
  }

  const user: IRegestationBody = { name, email, password };

  const activationToken = createActivationToken(user);
  const activationCode = activationToken.activationCode;

  const data = {
    user: { name: user.name, email: user.email },
    activationCode,
  };

  try {
    await sendEmail({
      email: user.email,
      subject: "Activate your Account",
      template: "activation-mail.ejs",
      data,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Please check your email!",
      data: activationToken.token,
    });
  } catch (error: any) {
    throw new AppError(401, error.message);
  }
});
const socialLogin = catchAsync(async (req, res) => {
  const { name, email, picture } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    if (isUserExist.provider) {
      const result = await sendToken(isUserExist, res);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login sucessful!",
        data: result,
      });
    }
    throw new AppError(401, "You can't login with google");
  } else {
    const userData = {
      name,
      email,
      avater: {
        url: picture,
      },
      role: "User",
      provider: "google",
    };
    const user = await userModel.create(userData);
    const result = await sendToken(user, res);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login sucessful!",
      data: result,
    });
  }
});

const activateUser = catchAsync(async (req, res) => {
  const { activation_code, activation_token } = req.body;

  const newUser = jwt.verify(
    activation_token,
    config.activation_secret as string
  ) as JwtPayload;

  if (newUser?.activationCode !== activation_code) {
    throw new AppError(400, "Invalide activation code");
  }
  const { name, email, password } = newUser.user;

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    throw new AppError(400, "Email already exist!");
  }

  const user = await userModel.create({ name, email, password });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active your Email sucessfull!",
    data: user,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(404, "Please enter your email and password");
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(404, "Invalid email or password");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new AppError(400, "Invalid email or password");
  }

  const result = await sendToken(user, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Log in sucessfull!",
    data: result,
  });
});

const logOutUser = catchAsync(async (req, res) => {
  res.clearCookie("access_token", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.clearCookie("refresh_token", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully logged out 😏",
    data: null,
  });
});

const getUserInfo = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const user = await userModel.findById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: user,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { name, avater, address, phone } = req.body;
  const userId = req.user?._id;

  const updateData: any = {};

  if (name) updateData.name = name;
  if (address) updateData.address = address;
  if (phone) updateData.phone = phone;

  if (avater) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.avater?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avater.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(avater, {
      folder: "avaters",
    });

    updateData.avater = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update your profile successfully!",
    data: updatedUser,
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError(400, "Enter your old and new password");
  }

  const user = await userModel.findById(req.user?._id).select("+password");

  if (!user || !user.password) {
    throw new AppError(400, "Invalid user");
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    throw new AppError(400, "Invalid old password");
  }

  // Use findByIdAndUpdate to update the user's password
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user?._id,
    { password: newPassword },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    }
  );

  if (!updatedUser) {
    throw new AppError(400, "Failed to update password");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "update your password successfully!",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const user = await userModel.find().sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrive successfully!",
    data: user,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id, role } = req.body;
  const user = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users role update successfully!",
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users delete successfully!",
    data: user,
  });
});

const updateCourseAccess = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const courseId = req.params?.id;
  const { moduleNo, videoNo } = req.body;

  if (!userId || !courseId) {
    throw new AppError(404, "User ID or Course ID is missing");
  }

  const user = await userModel.findOneAndUpdate(
    { _id: userId, "courses.courseId": courseId },
    {
      $set: {
        "courses.$.moduleNo": moduleNo,
        "courses.$.videoNo": videoNo,
      },
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError(404, "User or course not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users role update successfully!",
    data: user,
  });
});

export const userController = {
  registationUser,
  activateUser,
  login,
  logOutUser,
  getUserInfo,
  updateUserProfile,
  updatePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateCourseAccess,
  socialLogin,
};
