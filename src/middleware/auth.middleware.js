import { UserStudent } from "../model/userStudent.model.js";
import ApiError from "../utils/ApiError.js";
import { asynchandlar } from "../utils/asynchandler.js";
import { Instructor } from "../model/userInstructor.model.js";
import jwt from "jsonwebtoken"
const userAuthorise=asynchandlar(async (req,res,next)=>{
   try {
      let token= await req.cookies?.refreshToken || req.header("Authorization");

      if (!token) {
         throw new ApiError(401, 'Refresh token is not defined');
     }
     if (token && token.startsWith("Bearer ")) {
      token = token.slice(8, token.length).trim(); // This line will cause an error
    }
   
      const decodeToken = jwt.verify(token,process.env
         .REFRESH_TOKEN_SCRIPT);
         if (!decodeToken) {
            throw new ApiError(401, 'Invalid token');
          }
      const user= await UserStudent.findById(decodeToken._id)
      .select("-password -refreshToken");

      if(!user){
         throw new ApiError(404,"unauthorise access");
      }
      req.user=user;
      next();
   } catch (error) {
      console.log("token where the data store",req.header("Authorization"))
      throw new ApiError(404,error?.message || "invalid Access token")
      
   }
})
const instructorAuthorise=asynchandlar(async (req,res,next)=>{
   try {
      const token=await req.cookies?.refreshToken;
      if (!token) {
         throw new ApiError(401, 'Refresh token is not defined');
     }
      const decodeToken = jwt.verify(token,process.env
         .REFRESH_TOKEN_SCRIPT )
      
      const user= await Instructor.findById(decodeToken._id)
      .select("-password -refreshToken");

      if(!user){
         throw new ApiError(404,"unauthorise access");
      }
   
      req.user=user;
      next();
   } catch (error) {
      throw new ApiError(404,error?.message || "invalid Access token")
      
   }
})
export {userAuthorise,instructorAuthorise};