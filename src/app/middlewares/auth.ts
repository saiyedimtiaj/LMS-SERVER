import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { userModel } from "../modules/user/user.model";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const isAuthenticated: any = catchAsync(async (req, res, next) => {
  const access_Token = req.cookies.access_token;

  const decode = jwt.verify(
    access_Token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as DecodedToken;

  if (!decode) {
    throw new AppError(400, "Access token is not valid");
  }

  const user = await userModel.findById(decode.id);

  if (!user) {
    throw new AppError(400, "User not found");
  }

  req.user = user!;
  next();
});

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      throw new AppError(400, "You are not allow to this route");
    }
    next();
  };
};
