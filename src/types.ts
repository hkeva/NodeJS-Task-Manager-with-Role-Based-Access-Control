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

export interface IProject {
  title: string;
  description: string;
  files?: any[];
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}
