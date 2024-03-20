import { errorMessage } from "@src/constants/messages/errorMessages";
import { BadRequestError } from "@src/responses/errorHandler";
import UserRepository from "@repositories/user";
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

// Generate JWT for email verification
export const generateEmailToken = (email: string) => {
  const token = jwt.sign(
    { email },
    process.env.EMAIL_VERIFICATION_PRIVATE_KEY,
    { expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY }
  );
  return token;
};

export const verifyEmailToken = async (token: string) => {
  const tokenExists = await UserRepository.findEmailTokenByToken(token);

  if (!tokenExists) throw new BadRequestError(errorMessage.invalidToken);

  const result: any = jwt.verify(
    token,
    process.env.EMAIL_VERIFICATION_PRIVATE_KEY,
    async (err: any, data: any) => {
      if (err?.name === "TokenExpiredError") {
        await UserRepository.deleteEmailTokenByToken(token);
        throw new Error(errorMessage.tokenExpired);
      }

      if (err) throw new Error(err);

      return data;
    }
  );

  return result;
};

export const regenerateEmailToken = async (userId: string, email: string) => {
  let token: string;

  const currentToken = await UserRepository.findEmailTokenById(userId);

  //If there is already an existing token, then check the expiry time
  if (currentToken) {
    jwt.verify(
      currentToken.token,
      process.env.EMAIL_VERIFICATION_PRIVATE_KEY,
      async (err: any, data: any) => {
        if (err?.name === "TokenExpiredError")
          await UserRepository.deleteEmailTokenByToken(currentToken.token);
        else token = currentToken.token;

        return data;
      }
    );
  }

  //If the current token is expired, then generate a new token
  if (!token) {
    token = jwt.sign({ email }, process.env.EMAIL_VERIFICATION_PRIVATE_KEY, {
      expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY,
    });

    await UserRepository.createEmailVerificationToken(userId, token);
  }

  return token;
};
