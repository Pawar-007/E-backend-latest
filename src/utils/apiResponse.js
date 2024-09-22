class ApiResponse{
   constructor(statuscode="success",data= null,token,message=''){
     this.statuscode=statuscode<400,
     this.data=data,
     this.token=token,
     this.message=message 
   }
}

export  {ApiResponse}