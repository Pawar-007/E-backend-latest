import { Course } from "../model/course.model.js";
import ApiError from "../utils/ApiError.js";
import { asynchandlar } from "../utils/asynchandler.js";
import {uplodeVideoOnCloudnary, uplodeImage} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiResponse.js";
const uplodeVideoTuto=asynchandlar(async (req,res)=>{

    const courseId=await req.body.courseId;
    const user=await req.user;
    console.log("user",user); 
    console.log("body",req.body)
    const localPath=await req.files.video[1].path
    console.log("video",localPath);
    const imagelocalPath=await req.files

    const courseFind = await Course.findOne(
            { courseId: courseId ,
            instructor:user._id} 
    ); 
    
    if (!courseFind) {
        throw new ApiError(404, "Course not found");
    }
    if(!localPath){
        throw new ApiError(404,"localPath is not define")
    } 
    if(!imagelocalPath){
        throw new ApiError(404,"cover image for video is not given")
    }
    let uplodeVideo = await uplodeVideoOnCloudnary(localPath);
    let coverphoto=await uplodeImage(imagelocalPath);
    if(!uplodeVideo){
        throw new ApiError(404,"document is not uploded"); 
    }
    if(!coverphoto){
        throw new ApiError(404,"coverphoto is not uploded on cloudary")
    }
    
    if(String(courseFind.instructor) !== String(user._id)){
        throw new ApiError(400,"User is not the instructor for this course")
    }
    
    // const createContent = await Content.create({
    //     courseId:courseFind._id,
    //     contentType:"video",
    //     contentLink:uplodeVideo.secure_url

    // })
    
    const createContent=await Course.updateOne(
        {_id:courseFind._id},
        { 
            $push:{
                courseVideos:
                    {
                      videolink:uplodeVideo.secure_url,
                      coverImage:coverphoto.secure_url
                    }
            }
        }
    )
    console.log(Course)
    return res
    .status(200)
    .json(
         new ApiResponse(200,createContent,"content uplode successfully")
    )
 
})



export {uplodeVideoTuto}