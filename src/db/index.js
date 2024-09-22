import mongoose from "mongoose";
import { DB_name } from "../constant.js";
import dotenv from "dotenv";

dotenv.config()
const connectDB = async () => {
  try {
    const Db_connection = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_name}`);
    console.log("Database connected" ,Db_connection.connection.host );
    return Db_connection;
  } catch (error) {
    console.error("Mongoose connection failed:", error.message);
    process.exit(1); // Use 1 to indicate that the process is exiting due to an error
  }
};

export { connectDB };
