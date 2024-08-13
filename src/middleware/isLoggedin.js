const { APIError } = require("../../utils/Handlers");
const jwt=require("jsonwebtoken");
const User = require("../models/User.model");
require("dotenv").config();

async function verifyUser(req,res,next){
    // console.log("cookies: ",req.cookies);
    // console.log("req.header: ",req.header("Authorization"));
    let accessToken=req.cookies?.accessToken || req.header("Authorization")?.replace
    ("Bearer ","");
    // console.log(accessToken)
    if(!accessToken){
        throw new APIError(400,"unauthorized request","no one is logged in")
    }

    try {
        const decodedToken=await jwt.verify(accessToken,process.env.JWT_SECRET);
        // console.log(decodedToken);
         let user=await User.findById(decodedToken?._id);
    
    // console.log(user);
    if(!user)
    throw new APIError(400,"invalid access","token is invalid").select("-password -accessToken");
    req.user=user;
    next();
    } catch (error) {
        // console.log(error)
    }
   
}
module.exports=verifyUser;