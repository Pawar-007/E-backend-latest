import { asynchandlar } from "../utils/asynchandler.js";
import { UserStudent } from "../model/userStudent.model.js";
import jwt from "jsonwebtoken";
const isTokenExpire=asynchandlar(async (req,res)=>{
   const {token}=req.body;
   
   const decodeToken=await jwt.verify(token,process.env.REFRESH_TOKEN_SCRIPT);
   
   if(!decodeToken || decodeToken.exp * 1000 < Date.now()){
      
      res.status(401).json({"message ":"token expire ",isExpire:true});
      throw new Error("jwt expire");
   }  

   return res.status(200)
   .json({"message":"not expire ",isExpire:false});

})
export default isTokenExpire;