import { Router } from "express";
import { uplode } from "../middleware/multer.middleware.js";
import { videouplode } from "../uplodevideo.js";
import { loginUser, studentRegistration,logoutUser, instructorRegistration } from "../controller/user.controller.js";
import { userAuthorise } from "../middleware/auth.middleware.js";
import {returnVideoContent,deleteCoures,presentCourses} from "../controller/course.controller.js"
import {isTeacher} from "../middleware/isTeacher.middleware.js"
import {uplodeVideoTuto} from "../controller/courseContent.controller.js";
import {isEnorled} from "../middleware/isEnrole.js"
import {Enroleuser, deleteEnrolement} from "../controller/enrolement.controller.js"
import isTokenExpire from "../controller/tokenVerify.controller.js";
const router=Router();
    
router.route('/uplodeimage').post(
   uplode.fields([
      {
         name:"image",
         maxcount:1
      } 
   ]),
   videouplode);

router.route('/studentRegistration').post(
     uplode.fields([
         {
            name: "image",
            maxCount: 1
         }
      ]),
      studentRegistration
   );
   
router.route("/tokenVerify").post(isTokenExpire)
router.route('/loginUser').post(loginUser)
router.route('/logout').post(userAuthorise,logoutUser);
// router.route('/userType').post(userAuthorise,defineCourse);
 
router.route("/enrole").post(userAuthorise,Enroleuser);
router.route("/course_detail").post(isEnorled,returnVideoContent);
router.route("/delete_Enrolement_in_course").post(userAuthorise,deleteEnrolement);
router.route("/deleteCourse").post(isTeacher,deleteCoures);
router.route("/presentCourses").get(presentCourses);
export {router}