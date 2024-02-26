import { multerUploadMiddleware } from "../middlewares/fileUpload";
import { AuthenticateUser } from "@middlewares/auth";
import ProjectValidator from "@middlewares/project";
import ProjectController from "@controllers/project";
import express from "express";

const router = express.Router();

router.post(
  "/project/create",
  AuthenticateUser,
  multerUploadMiddleware,
  ProjectValidator.create,
  ProjectController.createProject
);

export default router;
