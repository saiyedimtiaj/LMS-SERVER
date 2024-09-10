import { Model, Schema, model } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at last 6 characters"],
      select: false,
    },
    address: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    avater: {
      public_id: { type: String },
      url: { type: String },
    },
    role: { type: String, default: "User" },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "course",
        },
        videoNo: { type: Number },
        moduleNo: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//sign access token
userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m",
  });
};

//sign access token
userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "7d",
  });
};

//compair password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userModel: Model<IUser> = model("User", userSchema);
