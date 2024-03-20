import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDatabase = async () => {
  try {
    const client = await mongoose.connect(uri || "");
    if (client) console.log("Database is successfully connected!!");
  } catch (error) {
    const message = "Database connection error";
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(message);
  }
};

export default connectDatabase;
