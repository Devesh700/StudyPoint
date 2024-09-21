function AsyncHandler(fn){
    return (req,res,next)=>{
     Promise.resolve(fn(req,res,next)).catch((err)=>{next(err)})
   }
}
class APIError extends Error{
  constructor(
          statusCode="",
          message="something went wrong",
          errors=[],
          stack
          ){
              super(message);
              this.statusCode=statusCode;
              this.errors=errors;
              this.message=message;
              this.ok=false;

              if(stack){
                this.stack=stack;
              }
              else{
                Error.captureStackTrace(this,this.constructor)
              }
          }
}


class APIResponse{
  constructor(statusCode,data,message,ok){
    this.statusCode=statusCode;
    this.data=data;
    this.message=message;
    this.ok=ok?ok:true;
  }
}

module.exports={AsyncHandler,APIError,APIResponse};