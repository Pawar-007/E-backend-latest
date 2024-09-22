import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

import dotenv from 'dotenv'
import { response } from 'express';
dotenv.config();
cloudinary.config({
   cloud_name:process.env.CLOUDNARY_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET
})

async function uplodeVideoOnCloudnary(localpath){
   try {
       const result= await new Promise((resolve,reject)=>{
         cloudinary.uploader.upload_large(
            localpath,
            {chunk_size:10000000, resource_type:"video"},
            (error,result)=>{ 
               if(error){
                  reject(error); 
               }
               else{ 
                  resolve(result)
               }
            })
         
      })
    fs.unlinkSync(localpath);

    return result;
   } 
   catch (error) {
      
      console.log(error);
   }
}

const deleteFromCloudnary=async (publicId,resourseType)=>{
   try {
      const remove = await new Promise((resolve,reject)=>{
         return cloudinary.uploader.destroy(
            publicId,
            {resource_type:resourseType},
            (error , result)=>{
               if(result){
                  resolve(result)
               }
               else{
                  reject(error);
               }
            });
      })
      return remove;
   } catch (error) {
      console.log("error",error)
   }
}
const uplodeImage=async (localPath)=>{
     try {
      const uplodeimage=await cloudinary.uploader.upload(localPath,{resource_type:"image"});
      fs.unlinkSync(localPath);
      return uplodeimage;
     } catch (error) {
      console.error("error",error.message); 
     }
}

export 
{uplodeVideoOnCloudnary,
 deleteFromCloudnary,
 uplodeImage
};