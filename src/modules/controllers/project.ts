import { successMessage } from "@src/constants/messages/successMessages";
import { NextFunction, Response } from "express";
import HttpStatus from "@src/responses/httpStatus";
import ProjectService from "@services/project";
import { AuthenticatedRequest } from "@src/types";

class ProjectController {
  async createProject(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await ProjectService.createProject(
        req.user,
        req.body,
        req.files
      );
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.projectCreated,
      });
    } catch (error) {
      return next(error);
    }
  }

  async assignToProject(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await ProjectService.assignToProject(req.user, req.body);
      return res.status(HttpStatus.OK).json({
        result: result,
        message: successMessage.developersAssigned,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new ProjectController();
