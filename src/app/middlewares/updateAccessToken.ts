import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { userModel } from "../modules/user/user.model";
import { accessTokenOptions, refreshTokenOptions } from "../utils/jwt";

export const updateAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token as string;

  if (!refreshToken) {
    throw new AppError(400, "Refresh token not provided");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;

  if (!decoded) {
    throw new AppError(400, "Could not refresh token");
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    throw new AppError(400, "User not found");
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "5m" }
  );

  const refresh_Token = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  req.user = user;

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refresh_Token, refreshTokenOptions);

  next();
});
