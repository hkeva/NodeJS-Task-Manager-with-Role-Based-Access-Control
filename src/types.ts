import { Request } from "express";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}
