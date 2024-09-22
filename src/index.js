import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
   path:"./env"
})


connectDB()
.then(()=>{
   app.on('error',()=>{
      console.log("server connection fail")
   })
   app.listen(process.env.PORT || 4000 ,()=>{
      console.log(`server is running at port ${process.env.PORT}`)
   })
})
.catch((error)=>{
   console.log('error is detected',error)
})