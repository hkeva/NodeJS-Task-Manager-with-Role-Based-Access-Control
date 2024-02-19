import { userRoles } from "@src/constants/constants";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [userRoles.ADMIN, userRoles.PROJECT_MANAGER, userRoles.DEVELOPER],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model<any>("user", userSchema);

export default User;
