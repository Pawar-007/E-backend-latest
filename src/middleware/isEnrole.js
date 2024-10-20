import { Course } from "../model/course.model.js";
import { Enrolement } from "../model/enrolement.model.js";
import { UserStudent } from "../model/userStudent.model.js";
import ApiError from "../utils/ApiError.js";
import { asynchandlar } from "../utils/asynchandler.js";
import Jwt  from "jsonwebtoken";
const isEnorled=asynchandlar(async(req,res,next)=>{
    try {
       let token=await req.cookies?.refreshToken || req.header("Authorization");
        
       const courseId=await req.body.courseId;  
       if (!token || !courseId) { 
         throw new ApiError(400, "Missing accessToken or courseId");
        }
        if (token && token.startsWith("Bearer ")) {
          token = token.slice(8, token.length).trim(); // This line will cause an error
        }
       const decodeToken= Jwt.verify(token,process.env.REFRESH_TOKEN_SCRIPT);
       
       const user=await UserStudent.findById(decodeToken._id).select("-password -accessToken")
  
       if(!user){
        throw new ApiError(404,"user should be login first");
       }
       const course=await Course.findOne({
        _id:courseId
       });
       
       const enrole=await Enrolement.findOne({
        userId:user._id,
        courseId:course._id
       })
       if(!enrole){
        throw new ApiError(404,"to access this course you need to register for this course");
       }
      req.user=user;
      req.courseId=courseId; 
      next();
    } catch (error) {
      console.error(error);
      next(error)
    }
    

})

export {isEnorled}