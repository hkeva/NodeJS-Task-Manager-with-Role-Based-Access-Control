import dotenv from "dotenv";
dotenv.config();

export const AuthData = {
  SALT_VALUE: 10,
};

export const userRoles = {
  ADMIN: "ADMIN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  DEVELOPER: "DEVELOPER",
};

export const FileConstants = {
  TOTAL_NUM_OF_FILES: 5,
  ALLOWED_FILE_SIZE: 1000000,
  FILE_PATH: process.env.LOCAL_URI + "/uploads/",
};
