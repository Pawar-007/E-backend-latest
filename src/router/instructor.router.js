import { instructorRegistration } from "../controller/user.controller.js";
import { Router } from "express";
import { uplode } from "../middleware/multer.middleware.js";
import { isTeacher } from "../middleware/isTeacher.middleware.js";
import { defineCourse,
         addQuiz,
         courseCreatedByInstructor,
         addVideoTutorials,
         deleteVideoTutorial, 
         returnVideoContent} from "../controller/course.controller.js";
import {uplodeVideoTuto} from "../controller/courseContent.controller.js"
import {userAuthorise} from "../middleware/auth.middleware.js"
const Irouter=Router();

Irouter.route('/instructorRegistration').post(userAuthorise,instructorRegistration);
Irouter.route('/AddCourse').post(isTeacher,
   uplode.fields([
      {
         name:"coverImage",
         maxCount:1
      }
   ]),
   defineCourse);
Irouter.route('/add-course-video')
   .post(isTeacher,
      uplode.fields([
         {
            name:'video',
            maxCount:10
         },
         {
            name:"image",
            maxCount:10
         }
      ]),
      addVideoTutorials);
Irouter.route("/thoughtCorse").get(isTeacher,courseCreatedByInstructor);
Irouter.route("/deletecontent").post(isTeacher,deleteVideoTutorial);
Irouter.route("/returnVideo").post(isTeacher,returnVideoContent);
Irouter.route("/add-test").post(isTeacher,addQuiz);
export {Irouter}