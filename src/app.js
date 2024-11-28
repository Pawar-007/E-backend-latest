import express, { json } from "express";
import cros from "cors"
import {router} from "./router/user.router.js"
import { Irouter } from "./router/instructor.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app=express();

app.use(cros({
   origin:`${process.env.FRONTEND_CROS_ORIGIN}`,
   credentials:true
}))

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

export {app};  