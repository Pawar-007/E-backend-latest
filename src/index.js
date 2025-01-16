import express, { json } from "express";
import cros from "cors"
import {router} from "./router/user.router.js"
import { Irouter } from "./router/instructor.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { connectDB } from "./db/indexdb.js";
import serverless from 'serverless-http'; 
import ApiError from "./utils/ApiError.js";
const app=express();
dotenv.config({
   path:"./env"
})

app.use(cors({
   origin: [
    process.env.FRONTEND_CROS_ORIGIN,
    process.env.FRONTEND_CROS_ORIGIN_2,
    "http://localhost:5173/"
  ],
   credentials:true
}))

connectDB()
.then(()=>{
   console.log("database connected successfully");
})
.catch(()=>{
   console.log("failed to connect to db");
})  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/",(req,res)=>{
   console.log("hello")
   res.status(200).send("hello,friends. start learning with flyer");
})
app.get("/intro",(req,res)=>{
   console.log("introducton")
   res.send("welcome to flyer");
})
app.use("/api/v1",router);
app.use("/api2/v2/inst",Irouter);

app.use((err, req, res, next) => {
   if (err instanceof ApiError) {
      // If the error is an instance of ApiError, return the structured JSON error
      return res.status(err.statusCode).json(err.toJSON());
   }

   // Default error handler for unhandled errors
   console.error("Unexpected Error:", err);
   return res.status(500).json({
      statusCode: 500,
      message: 'Something went wrong, please try again later.'
   });
});


app.listen(process.env.PORT || 4000 ,()=>{
   console.log(`server is running at port ${process.env.PORT}`)
})

export default serverless(app);