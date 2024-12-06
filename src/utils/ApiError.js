// import { Error } from "mongoose";
// class ApiError extends Error{
//    constructor(statuscode,message,stack=""){
//         super(message),
//         this.statuscode=statuscode,
//         this.message=message,
//         this.stack=stack
//       }
    
// }
//export default ApiError;
import { Error } from "mongoose";

export default class ApiError extends Error {
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack || new Error().stack;
  } 

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
} 

// export default ApiError;
 
// export default class ApiError extends Error{
//   constructor(
//      statuscode,
//      message="something went wrong",
//      error=[],
//      stack="" 
//   ){
//       super(message);
//       this.statusCode=statuscode;
//       this.data=null;
//       this.stack=stack;
//       this.errors=error;

//       if(stack){
//         this.stack=stack;
//       }
//       else{
//         Error.captureStackTrace(this,this.constructor)
//       }
//   }
// }