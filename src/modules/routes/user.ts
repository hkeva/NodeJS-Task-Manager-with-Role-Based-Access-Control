import { AuthenticateUser } from "../middlewares/auth";
import UserController from "@controllers/user";
import UserValidator from "@middlewares/user";
import express from "express";

const router = express.Router();

router.post("/user/create", UserValidator.create, UserController.createUser);
router.post("/user/login", UserValidator.login, UserController.login);
router.post(
  "/user/refresh-token",
  UserValidator.refreshToken,
  UserController.refreshToken
);
router.post("/user/logout", UserValidator.logout, UserController.logout);
router.post(
  "/user/assign-project-manager-role",
  AuthenticateUser,
  UserValidator.changeUserRole,
  UserController.changeUserRole
);

export default router;
