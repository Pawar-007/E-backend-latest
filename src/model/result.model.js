import {Schema , model} from "mongoose"

const resultSchema=new Schema({
   userId:{
      type:Schema.Types.ObjectId,
      ref:"UserModel",
      require:true
   },
   courseId:{
      type:Schema.Types.ObjectId,
      ref:"Course",
      require:true
   },
   quizId:{
      type:Schema.Types.ObjectId,
      ref:"Quiz",
      require:true
   },
   Score:{
      type:Number,
      require:true
   },
   correctSelected: [
      {
          question: {
              type: String,
              required: true
          },
          selecteAnswer: { 
            type: String,
            required: true
        }
      }
  ],
  wrongSelected: [
      {
          question: {
              type: String,
              required: true
          },
          selecteAnswer: { 
            type: String,
            required: true
        },
          correctAnswer: {
              type: String,
              required: true
          }
      }
  ]
},{
   timestamps:true
})

export const Result=new model("ResultModel",resultSchema);