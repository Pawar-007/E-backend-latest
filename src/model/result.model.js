import {Schema , model} from "mongoose"

const resultSchema=new Schema({
   userId:{
      type:Schema.Types.ObjectId,
      ref:"UserModel"
   },
   courseId:{
      type:Schema.Types.ObjectId,
      ref:"Course"
   },
   quizId:{
      type:Schema.Types.ObjectId,
      ref:"Quiz"
   },
   Score:{
      type:String
   }
},{
   timestamps:true
})

export const Result=new model("ResultModel",resultSchema);