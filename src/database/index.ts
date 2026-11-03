import mongoose from "mongoose";
import { Dbstring } from "../config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(Dbstring as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
