import { Schema,model } from "mongoose";

const enroleSchema=new Schema(
   {
   userId:{
      type:Schema.Types.ObjectId,
      ref:"UserModel"
   },
   courseId:{
      type:Schema.Types.ObjectId,
      ref:"Course"
   },
   paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
// e.g., 'card', 'paypal'
    },
    transactionId: {
      type: String, // Store the payment gateway's transaction ID

    },
    amountPaid: {
      type: Number, // Store the amount the user paid for the course
     
    }
  },
  {
   timestamps:true
  }
)


export const Enrolement=new model("EnrolementModel",enroleSchema);