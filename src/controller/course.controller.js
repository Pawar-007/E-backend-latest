import { Course } from "../model/course.model.js";
import ApiError from "../utils/ApiError.js";
import { Instructor } from "../model/userInstructor.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandlar } from "../utils/asynchandler.js";
import { Content } from "../model/courseContent.model.js";
import { Result } from "../model/result.model.js";
import { uplodeVideoOnCloudnary,uplodeImage, deleteFromCloudnary } from "../utils/cloudnary.js";
import mongoose from "mongoose";
const defineCourse=asynchandlar(async (req,res)=>{
   const user= req.user;
   const {courseName,description,courseId} = req.body;
   console.log({courseName,description,courseId})
   console.log("req body",req.body);
   const coverImage=req.files.coverImage[0].path;
   if(!coverImage){
      throw new ApiError(404,"coverImage is require");
   }

   if(!courseName || !description){
        throw new ApiError(404,"coursename and description is required")
   }
   
   const coverphoto=await uplodeImage(coverImage);
   if(!coverphoto){
      throw new ApiError(404,"image is not uplode successfully");
   }
  
   const isCoursePresent=await Course.findOne({
      courseId:courseId,
      instructor:user._id,
      courseName:courseName,
   })
   if(isCoursePresent){
      throw new ApiError(401,"A course with this name already exists for this instructor")
   }
   
   const newCourse = await Course.create({
      courseId:courseId,
      courseName:courseName,
      description:description,
      instructor:user._id,
      coverImage:coverphoto.secure_url
   }) 
   const AddIdInInstructor = await Instructor.updateOne(
      { _id: user._id },
      {
         $push: {
            coursesTought: {
               courseId: newCourse._id
            }
         }
      }
   );
   
   if (AddIdInInstructor.modifiedCount === 0) {
      throw new ApiError(500, "Failed to add course to instructor");
   }
   return res 
   .status(200)
   .json(
      new ApiResponse(200,newCourse,"new course added")
   )

})

const returnVideoContent=asynchandlar(async(req,res)=>{
   const user=req.user;
   const courseId= req.courseId || req.body.courseID; 
   if(!user){
      throw new ApiError(404,"user is not define");
   }
   if (!courseId) {
      throw new ApiError(400, "Course ID is missing");
    }
   const course=await Course.findOne({
      _id:courseId
   });
   if(!course){
      throw new ApiError(404,"course is not define")
   }

   return res
   .status(200)
   .json(
      new ApiResponse(200,course,'',"content present in course")
   )

})


const deleteCoures=asynchandlar(async (req,res)=>{
   const user=req.user;
   const {courseName,courseId,courseVideos} = req.body;

   if(!courseName || !courseId){
      throw new ApiError(404,"coursename and courseId is required to delete the course")
   }  

   const course=await Course.findOneAndDelete(
      {
         _id:courseId, 
         instructor:user._id 
      }
      );
   
     if(!course){
      throw new ApiError(404,"not found",error.message)
     }
   
   const cloudDelete=await Promise.all(courseVideos.map(async (item) => {
      let imagePublicKey = publicID(item.coverImage);
      let videoPublicKey = publicID(item.videolink);
  
      const videoDeleted = await deleteFromCloudnary(videoPublicKey, "video");
      const imageDeleted = await deleteFromCloudnary(imagePublicKey, "image");
      console.log("seleted videos ",videoDeleted, " ", imageDeleted);
    }));  
   return res 
   .status(200) 
   .json( 
      new ApiResponse("200",course,"document is deleted successfully")
   )

})

const presentCourses=asynchandlar(async (req,res)=>{
   const course=await Course.find({});
   if(!course){
      throw new ApiError(404,"couces not present on this website")
   }

   return res
   .status(200)
   .json(
      new ApiResponse(200,course,"all cources prent in wensite")
   )
})
const uplodetut = async (body,localPath,imageLocalPath,courseId,index) => {
   try {
   const description=body;
   const uplodeVideo = await uplodeVideoOnCloudnary(localPath.path);
   const uplodeimage=await uplodeImage(imageLocalPath.path);
   console.log({
      "video":uplodeVideo.secure_url,
      "image":uplodeimage.secure_url,
      "description":body
   })
     if (!uplodeVideo) {
       throw new ApiError(404, "Document is not uploaded");
     }
     if(!uplodeimage){
      throw new ApiError(404, "Document is not uploaded");
     }
     const createContent = await Course.updateOne(
       { _id: courseId },
       {
         $push: {
           courseVideos: {
             videolink: uplodeVideo.secure_url,
             coverImage:uplodeimage.secure_url,
             description:body
           }
         }
       }
     );
     return createContent;
   } catch (error) {
     console.error('Error uploading video:', error);
     throw error;
   }
 };
 
 const addVideoTutorials = asynchandlar(async (req, res) => {
   const courseId = req.body.courseId;
   const user = req.user;
   const {video,image}=req.files;
   
   if (!video || !video || video.length === 0) {
     throw new ApiError(400, "No video files uploaded");
   }
 
   const localPath = video 
   const imageLocalPath=image
   // Find the course and validate the instructor
   const courseFind = await Course.findOne({ courseId: courseId, instructor: user._id });
   if (!courseFind) {   
     throw new ApiError(404, "Course not found");
   }
 
   if (String(courseFind.instructor) !== String(user._id)) {
     throw new ApiError(400, "User is not the instructor for this course");
   }
  
    try {
     const createContent = await Promise.all(
       localPath.map(async (item,index) => {
         const imagepath=imageLocalPath[index];
         const description=req.body[`description${index}`];
         return uplodetut(description,item,imagepath,courseFind._id,index);
       })
     );
 
     return res.status(200).json(
       new ApiResponse(200, createContent, "Content uploaded successfully")
     );
   } catch (error) {
     console.error('Error uploading videos and updating course:', error);
     return res.status(500).json(
       new ApiResponse(500, null, "Error uploading videos")
     );
   }
 });

const courseCreatedByInstructor=asynchandlar(async (req,res)=>{
     try {
      const user=await req.user;
      const instructor=await Instructor.findById(user._id);
      
      if(!instructor){
         throw new ApiError(500,"instructor is not register")
      }
      const userCourses = instructor.coursesTought;
      const courses = await Promise.all(userCourses.map(async (item) => {
         return await Course.findById(item.courseId).exec();
       }));
       const updatedCourses =courses.filter((course) => course !== null);
      console.log("course",updatedCourses);

      return  res.status(200).json(
         new ApiResponse(200,updatedCourses,"thought couces")
      );
     } catch (error) {
      console.error('Error retrieving courses:', error);

      return res.status(500).json(
         new ApiResponse(500,'','',"An error occurred while retrieving courses")
      );
     }
})
const publicID=(url)=>{
   const path=url.split('/');
   const publicPath=path[path.length-1];
   const publicId=publicPath.split('.')[0];
   return publicId;

}
const deleteVideoTutorial=asynchandlar(async (req,res)=>{
   try {
   const user=req.user;
   const {url,coverImage,courseID}= await req.body;
   console.log("body",req.body);
   if(!url){
      throw new ApiError(404,"path is not define");
   }
   const publicPath=publicID(url);
   const imgPath=publicID(coverImage);
   console.log("path",publicPath,imgPath);
   const course=await Course.findOne({
      courseId:courseID,
      instructor:user._id
   })
   
   if(!course){
      throw new ApiError(300,"course is not created by this instructor");
   }

   const deletedVideo=await deleteFromCloudnary(publicPath,'video');
   const deleteImg=await deleteFromCloudnary(imgPath,'image');
   console.log("cloud",deletedVideo);
   console.log("cloud",deleteImg);
   if (deletedVideo.result !== 'ok' && deleteImg.result !== 'ok') {
      throw new ApiError(404, "Video not deleted");
    }
   const updateCourse=await Course.updateOne(
      {_id:course._id},
      { 
         $pull:{
            courseVideos:{
               videolink:url
            }
         }
      }
   )
   
   if (updateCourse.modifiedCount === 0) {
      throw new ApiError(404, "No update was made to the course");
    }

   res
   .status(200)
   .json(
      new ApiResponse(200,updateCourse,'',"updated successfully")
   )
   
   } catch (error) {
      throw new ApiError(404,error)
   }
})
const addQuiz=asynchandlar(async (req,res)=>{
   try {
      const user=req.user;
      const quizdata=req.body?.newquiz;
      const courseId=req.body.courseId;
      if(!quizdata){
         throw new ApiError(404,"data not get ",error);
      }
      if(!courseId){
         throw new ApiError(404,"unvaild credintial not get id");
      }
      const isAuthTeacher=await Course.findOne({
         _id:courseId,
         instructor:user._id
      })
      console.log("isAuther",isAuthTeacher);
      if(!isAuthTeacher){
         throw new ApiError(404,"invalid user");
      }
      const course=await Course.findOneAndUpdate(
         {_id:courseId},
         {
            $push:{
               courseQuiz:quizdata
            }
         },
         { new: true }
      )
    
      if(!course){
         throw new ApiError(404,"course not found");
      }
      res.status(200)
      .json(
         new ApiResponse(200,course,"","quiz added successfully")
      )
   } catch (error) {
      res.status(500).json(
         new ApiError(500,"not added",error.message)
       );
   }
})

const deleteTestFromCourse=asynchandlar(async(req,res)=>{
   try {
      const {courseId,testId}=req.body;
      console.log("courseId,testId",courseId,testId)
      const user=req.user;
      console.log("user",user)
      if(!courseId || !testId){
         throw new ApiError(404,"No data available at the moment")
      }
      const deleteTest=await Course.findOneAndUpdate(
            {_id:courseId,
            instructor:user._id},
            {
               $pull:{
                  courseQuiz: { _id: testId }
               }
            }
         )
         console.log("deleted ",deleteTest);
      if(!deleteTest){
         throw new ApiError(404,"test not found")
      }

      res.status(200)
      .json(
         new ApiResponse(200,deleteTest,'',"test remove successfully")
      ) 
   } catch (error) {
      throw new ApiError(404,"not delete test");
   }
   })

const addTestScore=asynchandlar(async(req,res)=>{
   try {
      console.log(req.body.id);
      const { selectedOption, id: testId, courseId } = req.body;
      const userId=req.user._id;
      // Validate required fields
      if (!testId || !courseId) {
          throw new ApiError(404, "Credential error: Missing test or course ID");
      }

      // Fetch course by ID
      const course = await Course.findById(courseId);
      if (!course) {
          throw new ApiError(404, "Course not found");
      }
      // Find the test by ID within the course's quizzes
      const test =await course.courseQuiz.find((quiz) => quiz._id.toString() === testId);
     
      if (!test) {
          throw new ApiError(404, "Test not found in the specified course");
      } 
      const questions=test.questions;
      let score=0
      let results = {
         score: 0,
         Correct: [],
         wrong: [],
     };
      questions.forEach(questions => {
         let questionId=questions._id;
         let correctAnswer=questions.answer.trim();
         let selecteAnswer=selectedOption[questionId]?.trim();
         if(correctAnswer === selecteAnswer){
            score++;
            results.Correct.push({"question":questions.question,selecteAnswer})
         }
         else{
            results.wrong.push({"question":questions.question,selecteAnswer,correctAnswer})
         } 
      });
       let finalScore=(score/questions.length)*100;
       results.score=finalScore;
       
       let storeResult=await Result.create(
        {"userId":userId,
         "courseId":courseId,
         "quizId":test._id,
         "Score":results.score,
         "correctSelected":results.Correct,
         "wrongSelected":results.wrong
      }  
      )
       if(!storeResult){
         throw new ApiError(404,"problem in adding result",mongoose.error)
       }
       let updateGiveTest=await Course.findOneAndUpdate(
         { _id: courseId, "courseQuiz._id": test._id }, 
         {$set: { "courseQuiz.$.isGiven": true } },
         { new: true } 
      )
      console.log("updated",updateGiveTest);
      if(!updateGiveTest){
         throw new ApiError(404,"is given not updated")
      }
      res.status(200)
      .json(
         new ApiResponse(200,storeResult,'',"your score is generated")
      );
  } catch (error) {
      console.error("Error processing test score:", error.message);
      throw new ApiError(500, "Error processing test score");
  }
})
const getScore=asynchandlar(async (req,res)=>{
    try {
      const {quizId}=req.body;
      const user=req.user;
      if(!quizId || !user){
         throw new ApiError("404","invalid credintial");
      }

      const getscore=await Result.findOne({
         "quizId":quizId,
         "userId":user._id
      });
      if(!getscore){
         throw new ApiError(400,"score is not generated");
      }

      return res.status(200).
      json(
         new ApiResponse(200,getScore,"","you obtain score ")
      )
    } catch (error) {
      console.log(error.message);
      
    }
})
export 
{
 defineCourse,
 returnVideoContent,
 deleteCoures,
 presentCourses,
 addVideoTutorials,
 addQuiz,
 courseCreatedByInstructor,
 deleteVideoTutorial,
 deleteTestFromCourse,
 addTestScore,
 getScore
   } 