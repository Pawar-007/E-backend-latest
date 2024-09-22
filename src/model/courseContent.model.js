import { Schema,model } from "mongoose";

const contentSchema=new Schema({
   courseId:{
      type:Schema.Types.ObjectId,
      ref:"Course",
      required:true
   },
   contentType:{
      type:String,
      enum: ['video','document'],
      required:true
    },
    contentLink:{
      type:String,
      require:true
    }
},{
   timestamps:true
})

const Content=new model("ContentModel",contentSchema);

export {Content};