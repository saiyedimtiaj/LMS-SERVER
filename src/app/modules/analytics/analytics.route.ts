import { analyticsController } from "./analytics.controller";
import { Router } from "express";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";

const route = Router();

route.get(
  "/get-users-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  analyticsController.getUserAnylatics
);

route.get(
  "/get-course-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  analyticsController.getCourseAnylatics
);

route.get(
  "/get-order-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  analyticsController.getOrderAnylatics
);

route.get(
  "/dashboard-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  analyticsController.getDashboardData
);

export const analyticsRoute = route;
