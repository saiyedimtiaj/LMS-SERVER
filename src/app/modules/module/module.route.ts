import { Router } from "express";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";
import { moduleController } from "./module.controller";

const route = Router();

route.post(
  "/create-module",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  moduleController.createModule
);

route.delete(
  "/module/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  moduleController.deleteModule
);

route.get(
  "/get-course-module/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  moduleController.getCourseModule
);

export const moduleRoute = route;
