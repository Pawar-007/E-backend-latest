import mongoose from "mongoose";
import { DB_name } from "../constant.js";
import dotenv from "dotenv";

dotenv.config()
let cachedConnection = null;
const connectDB = async () => {
  if (cachedConnection) {
    console.log("Reusing existing database connection");
    return cachedConnection;
  }

  try {
    const Db_connection = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_name}`);
    console.log("Database connected" ,Db_connection.connection.host );
    cachedConnection = Db_connection;
    return Db_connection;
  } catch (error) {
    console.error("Mongoose connection failed:", error.message);
    throw new Error("Database connection failed. Please check your connection settings.");
  }
}; 

export { connectDB };
