const { APIError } = require("../../utils/Handlers");
const jwt=require("jsonwebtoken");
const User = require("../models/User.model");
require("dotenv").config();

async function verifyUser(req,res,next){
    //console.log(req)
    //console.log(req.body)
    
    let accessToken=req.cookies?.accessToken || req.header("Authorization")?.replace
    ("Bearer ","");
    
    if(!accessToken){
        throw new APIError(400,"unauthorized request","no one is logged in")
    }

    try {
        const decodedToken=await jwt.verify(accessToken,process.env.JWT_SECRET);
        
         let user=await User.findById(decodedToken?._id);
    
    
    if(!user)
    throw new APIError(400,"invalid access","token is invalid").select("-password -accessToken");
    req.user=user;
    next();
    } catch (error) { 
        if (error.name === 'TokenExpiredError') {
            return next(new APIError(401, "Token expired", "Your session has expired. Please log in again."));
        }
        
        if (error.name === 'JsonWebTokenError') {
            return next(new APIError(401, "Invalid token", "Token is invalid. Please log in again."));
        }

        // Handle other potential errors
        
        next(new APIError(500, "Internal server error", "An error occurred while verifying the token"));
    }
   
}
module.exports=verifyUser;