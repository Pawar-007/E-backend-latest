import { uplode } from "./middleware/multer.middleware.js";
import { ApiResponse } from "./utils/apiResponse.js";
import { uplodeVideoOnCloudnary } from "./utils/cloudnary.js"
const videouplode=async (req,res)=>{
    const localpath=await req.files.image[0].path;
    console.log(localpath)

   const cloudnaryUrl=await uplodeVideoOnCloudnary(localpath); 
   console.log("cloudnary video",cloudnaryUrl.secure_url);
  
   return res.status(200).json(
    new ApiResponse(200,cloudnaryUrl,"uplodedsuccessfully")
   )
}

export {videouplode};