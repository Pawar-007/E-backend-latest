const asynchandlar=(requesthandle)=>{
   return (req,res,next)=>{
        requesthandle(req,res,next)
       .catch((error)=>{
         console.error(error);
         next(error);
       })
   } 
}
 
export {asynchandlar};