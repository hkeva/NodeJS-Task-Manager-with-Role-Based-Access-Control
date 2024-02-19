import { errorMessage } from "@src/constants/messages/errorMessages";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { userRoles } from "@src/constants/constants";
import UserRepository from "@repositories/user";
import HttpStatus from "@src/responses/httpStatus";

const UserValidator = {
  create: [
    body("username")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.usernameRequired)
      .isLength({ max: 10 })
      .withMessage(errorMessage.invalidUsernameLength)
      .custom(async (value: string) => {
        const doesExist = await UserRepository.usernameExist(value);

        if (doesExist) {
          throw new Error(errorMessage.usernameAlreadyExists);
        }
        return true;
      }),
    body("email")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.emailRequired)
      .isEmail()
      .withMessage(errorMessage.invalidEmail)
      .custom(async (value: string) => {
        const doesExist = await UserRepository.emailExist(value);

        if (doesExist) {
          throw new Error(errorMessage.emailAlreadyExists);
        }
        return true;
      }),
    body("password")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.passwordRequired)
      .isLength({ min: 5 })
      .withMessage(errorMessage.invalidPasswordLength)
      .custom((value) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{6,}$/;
        if (!regex.test(value)) {
          throw new Error(errorMessage.wrongPasswordFormat);
        }

        return true;
      }),

    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      }
      next();
    },
  ],
  login: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.emailRequired)
      .isEmail()
      .withMessage(errorMessage.invalidEmail),
    body("password")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.passwordRequired),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      }
      next();
    },
  ],
  refreshToken: [
    body("token")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.refreshTokenRequired),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      }
      next();
    },
  ],
  logout: [
    body("refresh_token")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.refreshTokenRequired),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      }
      next();
    },
  ],
  changeUserRole: [
    body("userID")
      .trim()
      .notEmpty()
      .withMessage(errorMessage.userIdRequired)
      .isMongoId()
      .withMessage(errorMessage.invalidIdType),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors });
      }
      next();
    },
  ],
};

export default UserValidator;
