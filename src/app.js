import express, { json } from "express";
import cros from "cors"
import {router} from "./router/user.router.js"
import { Irouter } from "./router/instructor.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app=express();
// const corsOptions = { 
//    origin: [process.env.CORS_ORIGIN, process.env.FRONTEND_CORS_ORIGIN],
//    methods: ['GET', 'POST'],
//    credentials: true, // Correct option name
//  };
app.use(cros({
   origin:`${process.env.FRONTEND_CROS_ORIGIN}`,
   credentials:true
}))
// app.use(cros({
//    origin:true,
//    credentials:true
// }))
// app.use(cros())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/v1",router);
app.use("/api2/v2/inst",Irouter);

app.get("/",(req,res)=>{
   console.log("hello")
   res.send("hello,friends");
})
export {app};  