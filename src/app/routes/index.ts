import { Router } from "express";
import { courseRoute } from "../modules/course/course.route";
import { userRoute } from "../modules/user/user.route";
import { moduleRoute } from "../modules/module/module.route";
import { notificationRoute } from "../modules/notification/notification.route";
import { orderRoute } from "../modules/order/order.route";
import { analyticsRoute } from "../modules/analytics/analytics.route";

const router = Router();

const moduleRoutes = [
  {
    path: "",
    route: courseRoute,
  },
  {
    path: "",
    route: userRoute,
  },
  {
    path: "",
    route: moduleRoute,
  },
  {
    path: "",
    route: notificationRoute,
  },
  {
    path: "",
    route: orderRoute,
  },
  {
    path: "",
    route: analyticsRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
