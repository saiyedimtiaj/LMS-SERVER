import config from "../config";
import { IRegestationBody } from "../modules/user/user.interface";
import jwt from "jsonwebtoken";

export const createActivationToken = (user: IRegestationBody) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    config.activation_secret as string,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
