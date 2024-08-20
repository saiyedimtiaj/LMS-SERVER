import { notificatonController } from "./notification.controller";
import { Router } from "express";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";

const route = Router();

route.get(
  "/notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  notificatonController.getNotification
);

route.put(
  "/update-notifications/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  notificatonController.updateNotification
);

export const notificationRoute = route;
