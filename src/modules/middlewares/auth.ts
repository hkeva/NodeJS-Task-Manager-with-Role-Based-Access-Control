import { errorMessage } from "@src/constants/messages/errorMessages";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "@src/responses/httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "@src/types";

dotenv.config();

export const AuthenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: errorMessage.unauthorized,
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: errorMessage.unauthorized,
      });
    }

    req.user = user;
    next();
  });
};
