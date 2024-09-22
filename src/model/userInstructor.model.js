import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv"

import  Jwt  from "jsonwebtoken";
import { UserStudent } from "./userStudent.model.js";
dotenv.config();
const instructorSchema=new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   lastName:{
      type:String
   },
   userId:{
      type:Schema.Types.ObjectId,
      ref:"UserStudent",
      require:true
   },
   email:{
      type:String,
      required:true,
      unique: true
   },
   qualifications:{
      type:String,
      required:true
   },
   contact:{
      type:String,
      unique:true
   },
   coursesTought:[
      {
         courseId:{
            type :Schema.Types.ObjectId,
            ref:"Course"
         }
      }
   ]
},{
   timestamps:true
}

)

instructorSchema.methods.generateAccessToken=function(){
   return Jwt.sign(
      {
         _id:this._id,
         username:this.username,
         email:this.email
      },
        process.env.ACCESS_TOKEN_SCRIPT
      ,
      {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRE
      }
   )
}

instructorSchema.methods.generateRefreshToken=function(){
   return Jwt.sign(
      {
         _id:this._id
      },
      process.env.REFRESH_TOKEN_SCRIPT,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRE
      }
   )
}
const Instructor=new mongoose.model("Instructor",instructorSchema);

export {
   Instructor
};