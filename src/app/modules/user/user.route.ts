import { Router } from "express";
import { userController } from "./user.controller";
import { authorizeRole, isAuthenticated } from "../../middlewares/auth";
import { updateAccessToken } from "../../middlewares/updateAccessToken";
const route = Router();

route.post("/registation", userController.registationUser);
route.post("/activate-user", userController.activateUser);
route.post("/login", userController.login);
route.post(
  "/log-out",
  updateAccessToken,
  isAuthenticated,
  userController.logOutUser
);

route.post("/social-login", userController.socialLogin);

route.get("/refreshtoken", updateAccessToken);

route.get(
  "/me",
  updateAccessToken,
  isAuthenticated,
  userController.getUserInfo
);

route.put(
  "/update-user-info",
  updateAccessToken,
  isAuthenticated,
  userController.updateUserProfile
);

route.put(
  "/update-user-password",
  updateAccessToken,
  isAuthenticated,
  userController.updatePassword
);

route.get(
  "/get-users",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  userController.getAllUsers
);

route.put(
  "/update-user-role",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  userController.updateUserRole
);

route.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("Admin"),
  userController.deleteUser
);

route.put(
  "/update-access-course/:id",
  isAuthenticated,
  updateAccessToken,
  userController.updateCourseAccess
);

export const userRoute = route;
