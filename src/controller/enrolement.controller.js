import { Course } from "../model/course.model.js";
import { UserStudent } from "../model/userStudent.model.js";
import ApiError from "../utils/ApiError.js";
import { asynchandlar } from "../utils/asynchandler.js";
import {Enrolement} from "../model/enrolement.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import cookies from "cookie-parser"
const Enroleuser=asynchandlar(async(req,res)=>{
   const userId=req.user._id;
   if(!userId){      
      throw new ApiError(400,"user is not define");
   }


   const user=await UserStudent.findById(userId);
   if(!user){
      throw new ApiError(404,"you want to register first")
   }

   const courseId=await req.body?.courseId; 
   if(!courseId){ 
      throw new ApiError(404,"provide the courseId");
   }
   const course=await Course.findOne({
      _id:courseId 
   })
   if(!course){
      throw new ApiError(404,"The requested course does not exist on our platform. Please check the course ID or browse available courses.")
   }
   const allredyEnrole=await Enrolement.findOne({
      courseId:course._id,
      userId:user._id 
   })
   if(allredyEnrole){
      throw new ApiError(404,"you are allredy enrole in this course")
   }
   const Enroleuser=await Enrolement.create({
      userId:user._id,
      courseId:course._id
   })

   const updateUser=await UserStudent.updateOne(
      {_id:user._id},
      {
      $push:{
         courceTaken:{
            courceId:course._id
         }
      }
   })
   const option=({
      httpOnly:true,
      secure:true
   })
   return res
   .status(200)
   .json(
      new ApiResponse(200,Enroleuser,"",`you successfully enrole for ${course.courseName}`)
   )
})

const deleteEnrolement=asynchandlar(async(req,res)=>{
   const userId=req.user._id;
   const courseId=req.body?.courseId;
   
   if(!userId){
      throw new ApiError(404,"user is not define");
   }

   const course=await Course.findOne({
      courseId:courseId
   })
   
   if(!course){
      throw new ApiError(404,"course is not define")
   }
   const user=await Enrolement.deleteOne({
      userId:userId,
      courseId:course._id

   });
   
   if(!user){
      throw new ApiError(404,"user is not found in enrollement");
   }

   const option=({
      httpOnly:true,
      secure:true
   })

   return res
   .status(200)
   .cookie("courseId",null,option)  
   .json(
      new ApiResponse(200,user,"user removed successfully")
   )

})

export {Enroleuser,deleteEnrolement}