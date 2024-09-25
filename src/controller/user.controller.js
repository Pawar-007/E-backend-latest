import { asynchandlar } from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js"
import {UserStudent} from "../model/userStudent.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Instructor } from "../model/userInstructor.model.js";
import { uplodeImage } from "../utils/cloudnary.js";
const generateAccessAndRefreshToken= async (userId)=>{
   const user = await UserStudent.findById(userId);
   const accessToken=await user.generateAccessToken();
   const refreshToken=await user.generateRefreshToken();
   user.refreshToken=refreshToken;
   await  user.save({ValidateBeforeSave:false});
   return {accessToken,refreshToken}

}
const studentRegistration=asynchandlar(async (req,res)=>{
   const {username,lastname,email,password}=req.body;
   const image=req.files && req.files.image && req.files.image[0] ? req.files.image[0].path : null;;
   console.log(
      "imagePath",image
   )
   if ( 
      [username,lastname, email, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required")
    }

   const exist=await UserStudent.findOne({
      $and:[
         { username: username },
         { email: email }
      ]
   })
   if(exist){
      throw new ApiError(400,"user already exist");
   }
   const setImage=await uplodeImage(image);
   if(!setImage){
      throw new ApiError(404,"registration fail");
   }
   const user=await UserStudent.create({
      username,
      lastname,
      email,
      password,
      coverImage:setImage.secure_url
   })
   
   const createUser=await UserStudent.findOne(user._id).
   select("-password");
   return res 
   .status(200)
   .json(
      new ApiResponse(200,createUser,"user register successfully")
   )
    
})

const loginUser=asynchandlar(async (req,res)=>{
   const {username,email,password}=await req.body;
  
   if (!username || !email){
      throw new ApiError(400,"username or email require")
   }

   const user=await UserStudent.findOne({
      $or:[{
         username:username,
         email:email
   }]
   })
   if(!user){
      throw new ApiError(404,"user not register yet")
   }

   const passwordCorrect=await user.ispasswordcorrect(password);
   
   if(!passwordCorrect){
      throw new ApiError(404,"your password is wrong");
   }
   const userlog=await UserStudent.findById(user._id).select("-password -refreshToken -accessToken");

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

   const Option= {  
      httpOnly:true,
      Secure:true, 
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,Option)
   .cookie("refreshToken",refreshToken,Option)
   .json(
       new ApiResponse(200,userlog,refreshToken,"login successfull",)
   )
   
})

const logoutUser=asynchandlar(async(req,res)=>{
     const user= req.user; 
     if(!user){
      throw new ApiError(404,"you are alredy logout");
     }
     const userLogout=await UserStudent.findByIdAndUpdate(user._id,
      {
         $set:{
            referenceToken:undefined
         }
      },{
         new:true
      });
      const option={ 
         http:true,
         Secure:true
      }
      return res
      .status(200)
      .cookie("accessToken",logoutUser.accessToken,option)
      .cookie("refreshToken",logoutUser.refreshToken,option)
      .json(
         new ApiResponse(200,userLogout,"user logout successfully")
      )
})
const instructorRegistration = asynchandlar(async (req, res) => {
   const { contact, qualifications} = req.body;
   const user = req.user;
   if (!user) {
      throw new ApiError(401, "Invalid authentication");
   }

   if (
      [contact, qualifications].some((field) => !field?.trim())
   ) {
      throw new ApiError(400, "All fields are required for registration");
   }
   
   const existingInstructor = await Instructor.findOne({
      $or: [
         { contact: contact },   
         { email: user.email }
      ]
   });

   if (existingInstructor) {
      throw new ApiError(409, "User is already registered");
   }

   const newInstructor = await Instructor.create({
      name: user.username,
      lastName: user.lastName,
      userId:user._id,
      email: user.email,
      qualifications: qualifications,
      contact: contact 
   });

   const instructorInfo = await Instructor.findById(newInstructor._id).select("-contact");

   return res
      .status(201)  // 201 Created status code
      .json(
         new ApiResponse(201, instructorInfo, "User registered successfully")
      );
});
export 
{
   studentRegistration,
   instructorRegistration,
   loginUser,
   logoutUser
}