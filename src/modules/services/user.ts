import { errorMessage } from "@src/constants/messages/errorMessages";
import {
  generateEmailToken,
  generateTokens,
  regenerateEmailToken,
  verifyEmailToken,
  verifyRefreshToken,
} from "@src/utils/tokens";
import { BadRequestError } from "@src/responses/errorHandler";
import { AuthData, userRoles } from "@src/constants/constants";
import { sendEmailVerificationMail } from "@src/utils/emails";
import UserRepository from "@repositories/user";
import UserToken from "@models/userToken";
import { IUser, ILogin } from "@src/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export class UserService {
  async createUser(userDetails: IUser) {
    //Hashing password
    const updatedPassword = await bcrypt.hash(
      userDetails.password,
      AuthData.SALT_VALUE
    );

    userDetails.password = updatedPassword;
    userDetails.role = userRoles.DEVELOPER;

    const user = await UserRepository.createUser(userDetails);

    if (!user) throw new BadRequestError(errorMessage.userNotCreated);

    const emailVerificationToken = generateEmailToken(userDetails.email);

    await UserRepository.createEmailVerificationToken(
      user._id,
      emailVerificationToken
    );

    sendEmailVerificationMail(
      userDetails.email,
      userDetails.username,
      emailVerificationToken
    );

    return user;
  }

  async login(loginCredentials: ILogin) {
    let token: string;
    const user = await UserRepository.emailExist(loginCredentials.email);

    if (!user) throw new BadRequestError(errorMessage.userNotExists);

    if (!user.isVerified) {
      token = await regenerateEmailToken(user._id, user.email);
      sendEmailVerificationMail(user.email, user.username, token);
      throw new BadRequestError(errorMessage.userNotVerified);
    }

    const verifyPassword = await bcrypt.compare(
      loginCredentials.password,
      user.password
    );

    if (!verifyPassword) throw new BadRequestError(errorMessage.wrongPassword);

    const { accessToken, refreshToken } = await generateTokens(
      user._id,
      user.email,
      user.role
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(token: string) {
    let accessToken: string;
    const result = await verifyRefreshToken(token);

    accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_PRIVATE_KEY);

    return { accessToken: accessToken };
  }

  async logout(token: string) {
    const tokenExists = await UserToken.findOne({
      token: token,
    });

    if (!tokenExists) throw new BadRequestError(errorMessage.tokenDoesNotExist);

    await UserToken.findOneAndDelete({
      token: token,
    });

    return true;
  }

  async changeUserRole(userID: string, reqUser: IUser) {
    if (reqUser._id === userID)
      throw new BadRequestError(errorMessage.adminRoleCanNotBeChanged);

    //Only ADMIN is authorized to change role
    if (reqUser.role !== userRoles.ADMIN)
      throw new BadRequestError(errorMessage.unauthorizedRequest);

    const user = await UserRepository.findByID(userID);

    if (user.role === userRoles.PROJECT_MANAGER)
      throw new BadRequestError(errorMessage.userRoleAlreadyPM);

    const result = await UserRepository.changeRole(
      userID,
      userRoles.PROJECT_MANAGER
    );

    return result;
  }

  async verifyEmail(token: string) {
    let isVerified: boolean;
    const result = await verifyEmailToken(token);

    if (result) isVerified = await UserRepository.verifyUser(result.email);

    if (isVerified) await UserRepository.deleteEmailTokenByToken(token);

    return isVerified;
  }
}

export default new UserService();
