import { successMessage } from "@src/constants/messages/successMessages";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "@src/responses/httpStatus";
import { AuthenticatedRequest } from "@src/types";
import UserService from "@services/user";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.createUser(req.body);
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.userCreated,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.login(req.body);
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.userLoggedIn,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.refreshToken(req.body.token);
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.newAccessTokenGenerated,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.logout(req.body.refresh_token);
      return res
        .status(HttpStatus.OK)
        .json({ message: successMessage.userLoggedOut });
    } catch (error) {
      return next(error);
    }
  }

  async changeUserRole(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await UserService.changeUserRole(
        req.body.userID,
        req.user
      );
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.userRoleChanged,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
