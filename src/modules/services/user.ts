import { errorMessage } from "@src/constants/messages/errorMessages";
import { generateTokens, verifyRefreshToken } from "@src/utils";
import { BadRequestError } from "@src/responses/errorHandler";
import { AuthData, userRoles } from "@src/constants/constants";
import UserRepository from "@repositories/user";
import UserToken from "../models/userToken";
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

    return user;
  }

  async login(loginCredentials: ILogin) {
    const user = await UserRepository.emailExist(loginCredentials.email);

    if (!user) throw new BadRequestError(errorMessage.userNotExists);

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
}

export default new UserService();
