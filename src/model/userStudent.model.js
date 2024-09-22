import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { Schema } from "mongoose";
const userSchema=new mongoose.Schema({
   username:{
      type:String,
      required:true
   },
   lastname:{
     type:String,  
   },
   email:{
      type:String,
      required:true
   },
   password:{
   type:String,
   required:true
   },
   accessToken:{
      type:String
   },
   refreshToken:{
     type:String
   },
   coverImage:{
       type:String
   },
   courceTaken:[{
      courceId:{
         type : Schema.Types.ObjectId,
         ref:"Course"
      }
   }],
},{
   timestamps:true
})

userSchema.pre("save",async function(next){
      try {
         if(!this.isModified("password")){
            return next();
         }
         this.password=await bcrypt.hash(this.password,10);
         next();
      } catch (error) {
         next(error)
      }
})
userSchema.methods.ispasswordcorrect=async function(password){
     return await bcrypt.compare(password,this.password);
}  

userSchema.methods.generateAccessToken= function(){
   return jwt.sign(
      {
         _id:this._id,
         username:this.username,
         email:this.email,
      },
      process.env.ACCESS_TOKEN_SCRIPT,
      {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRE
      }
   )
}

userSchema.methods.generateRefreshToken=function(){
   return jwt.sign(
      {
         _id:this._id,
      },
      process.env.REFRESH_TOKEN_SCRIPT,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRE
      }
   )
}


const UserStudent=new mongoose.model("UserStudent",userSchema);

export {UserStudent};