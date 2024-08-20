import { Router } from "express";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";
import { orderController } from "./order.controller";
const route = Router();

route.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  orderController.createOrder
);

route.get(
  "/get-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  orderController.getAllOrders
);

route.post("/payment", orderController.newPayment);

route.get(
  "/user-orders",
  updateAccessToken,
  isAuthenticated,
  orderController.getUsersOrders
);

export const orderRoute = route;
