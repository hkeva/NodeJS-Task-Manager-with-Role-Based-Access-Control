import { BadRequestError } from "./responses/errorHandler";
import { errorMessage } from "./constants/messages/errorMessages";
import UserToken from "@models/userToken";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateTokens = async (
  _id: string,
  email: string,
  role: string
) => {
  try {
    const payload = { _id: _id, email: email, role: role };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const userToken = await UserToken.findOne({ userId: _id });
    if (userToken) await UserToken.findOneAndDelete({ userId: _id });

    await new UserToken({ userId: _id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  const tokenExists = await UserToken.findOne({
    token: refreshToken,
  });

  if (!tokenExists) throw new BadRequestError(errorMessage.invalidToken);

  const result: any = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    (err: any, data: any) => {
      if (err?.name === "TokenExpiredError")
        throw new Error(errorMessage.tokenExpired);

      if (err) throw new Error(err);

      return data;
    }
  );

  return result;
};
