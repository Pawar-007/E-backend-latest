import express, { json } from "express";
import cros from "cors"
import {router} from "./router/user.router.js"
import { Irouter } from "./router/instructor.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";
const app=express();

dotenv.config({
   path:"./env"
})

app.use(cros({
   origin:`http://localhost:5173`,
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
   res.send("hello,friends");
})
app.get("/intro",(req,res)=>{
   console.log("introducton")
   res.send("welcome to flyer");
})
app.use("/api/v1",router);
app.use("/api2/v2/inst",Irouter);

app.listen(process.env.PORT || 4000 ,()=>{
   console.log(`server is running at port ${process.env.PORT}`)
})

export {app};  