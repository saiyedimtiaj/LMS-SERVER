import { Router } from "express";
import { courseController } from "./course.controller";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";

const route = Router();

route.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  courseController.uploadCourse
);

route.get("/get-courses", courseController.getAllCourse);
route.get("/get-course/:id", courseController.getSingleCourse);

route.get(
  "/get-admin-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  courseController.getAllAdminCourses
);

route.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  courseController.deleteCourse
);

route.get(
  "/user-courses",
  updateAccessToken,
  isAuthenticated,
  courseController.getUserCourses
);

route.get(
  "/access-all-module/:id",
  updateAccessToken,
  isAuthenticated,
  courseController.getAllModuleofSingleCourse
);

route.get(
  "/access-content/:id",
  updateAccessToken,
  isAuthenticated,
  courseController.getAccessVideoContent
);

route.get(
  "/get-module",
  updateAccessToken,
  isAuthenticated,
  courseController.getAllModule
);

route.put(
  "/update-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  courseController.updateCourse
);

export const courseRoute = route;
