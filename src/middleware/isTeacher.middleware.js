import {asynchandlar} from "../utils/asynchandler.js"
import  jwt  from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { Instructor } from "../model/userInstructor.model.js";
import { UserStudent } from "../model/userStudent.model.js";
const isTeacher=asynchandlar(async (req,res,next)=>{

   try {
      let token = req.cookies.refreshToken || req.header("Authorization") ;
      
      if (token && token.startsWith("Bearer")) {
         token = token.slice(8, token.length).trim(); // Remove 'Bearer ' prefix if present
      } 

      const decodeToken = jwt.verify(token,process.env.REFRESH_TOKEN_SCRIPT);
      const user=await UserStudent.findById(decodeToken._id);
      
      const instructor=await Instructor.findOne({
         userId:user._id
      })
      if(!instructor){
         return res.status(404).json({message:"User is not an instructor"})
      }
      
      req.user=instructor;
      next();
   } catch (error) {
      next(error);
   }

   
})

export {isTeacher}