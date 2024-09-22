import mongoose, { Schema } from "mongoose";
const questionSchema=new mongoose.Schema({
    question:{
      type:String,
      required:true
    },
    options:[
      {
        type:String,
        required:true
      }
    ],
    answer:{
      type:String,
      required:true
    }
})

const quizSchema=new mongoose.Schema({
  quizName:{
    type:String,
    required:true
  },
  course:{
    name:{
      type:String
    },
    details:{
      type:String
    }
  },
  questions:[questionSchema]
})
const courseSchema=new mongoose.Schema({
      courseId:{
          type:String,
          required:true
         },
       courseName:{
          type:String,
          required:true
       },
       coverImage:{
        type:String,
        required:true
       },
       description:{
        type:String,
        required:true
       }, 
       instructor:{
          type:Schema.Types.ObjectId,
          ref:"Instructor"
        },
      courseVideos: [ 
        {
          videolink:{
            type:String
          },
          coverImage:{
            type:String
          },
          description:{
            type:String
          }
        }
      ],
      courseQuiz:[quizSchema],
      documents: [
        {
          title: {
            type: String,
          },
          fileUrl: {
            type: String, // Store the URL or path of the document
          },
          description: {
            type: String, // Optional field for additional description
          },
        },
      ]
},{
  timestamps:true
})
const Course=new mongoose.model("Course",courseSchema);

export {Course};