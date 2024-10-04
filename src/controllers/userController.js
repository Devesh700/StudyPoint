const User = require("../models/User.model");
const mongoose=require("mongoose")
const upload = require("../middleware/multer");
const jwt=require("jsonwebtoken")
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");





//------------ REGISTER USER-------------



async function registerUser(req, res, next) {
    //console.log(req.body);
    let { email, fullName, password, mobileNo } = req.body;
    if ([email, fullName, password, mobileNo].some((val) => val?.trim() === "")) {
        throw new APIError(401, "All fields are reqruired")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { mobileNo }]
    })
    if (existedUser) {
        throw new APIError(202, "user already existed","user already existed")
    }
    // //console.log(req.files);
    const avtarLocalFilePath = req.files?.avtar ? req.files?.avtar[0]?.path : undefined;
    const coverImageLocalFilePath = req.files?.coverImage ? req.files?.coverImage[0]?.path : undefined;
    let avtar, coverImage;
    if (avtarLocalFilePath)
        avtar = await uploadToCloudinary(avtarLocalFilePath);
    //console.log(avtar);
    if (coverImageLocalFilePath)
        coverImage = await uploadToCloudinary(coverImageLocalFilePath);
    try {
        let user = await User.create({
            email: email,
            fullName: fullName,
            mobileNo: mobileNo,
            password: password,
            avtar: avtar?.secure_url,
            coverImage: coverImage?.secure_url
        })
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        let{accessToken,refreshToken}=await generateTokens(user._id);
        //console.log(createdUser);
        if (createdUser) {
            res.status(201).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken).json(new APIResponse(201, {user:createdUser,accessToken}, "user registered successfully", true));
        }
        else {
            res.status(500).json(new APIError(500, [], "something went wrong while registering user"));
        }
    } catch (err) {
        res.status(502).json(new APIError(502, "something went wrong while registering user", err.message))
        console.error(err)
    }
    //console.log(avtar);

}





//------------ LOGIN USER-------------




async function logInUser(req, res, next) {
    let { email, password } = req.body;
    //console.log(req.body);

    if (email === undefined || password === undefined)
        throw new APIError(400, "all fields are required", "does not receive necessary fields ")

    if ([email, password].some((val) => val?.trim() === "")) {
        throw new APIError(400, "all fields are required", "provided with empty fields")
    }

    let user = await User.findOne({ email });
    //console.log(user);

    if (!user) {
        throw new APIError(400, "user does not exist", "credentials provided does not exist in our database");

    }

    let validatePassowrd=await user.isPasswordCorrect(password);
    if (!validatePassowrd) {
        throw new APIError(400, "incorrect password", "password does not match");
    }

    const {accessToken,refreshToken}=await generateTokens(user._id);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }
    //console.log(loggedInUser)
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new APIResponse(200,{user:loggedInUser,accessToken,refreshToken},"logged in successfully"));

}




//------------ UPDATE USER-------------




async function updateUser (req,res,next){
    let {fullName,email,mobileNo,password,journey}=req.body;
    // //console.log("body:",req.body)
    if(!req.user?._id){
        throw new APIError(401,"user did not received while updating the user","invalid user");
    }
    
    const user=await User.findById(req.user._id);

    if(!user){
        throw new APIError(401,"user not found","invalid user");
    }

    let updateFields={};
    if(fullName!==undefined)
        updateFields.fullName=fullName;

    if(email!==undefined)
        updateFields.email=email;

    if(mobileNo!==undefined)
        updateFields.mobileNo=mobileNo;

    if(journey!==undefined){
        if( !user.journey?.some(elem=>elem?.name===journey.name)){
        updateFields.journey=user.journey? [...user.journey,journey]:journey
        }
        else{
            
            let journeyval=user?.journey?.map(elem=>{if(elem.name===journey.name){return journey} else return elem})
            updateFields.journey=[...journeyval];
        //console.log("journey: ",journey)
        //console.log(updateFields.journey)
        }
        }

    if(req.files?.avtar){
        avtarLocalFilePath=req.files.avtar[0].path;
        let avtar;
        if(avtarLocalFilePath)
            avtar=await uploadToCloudinary(avtarLocalFilePath);
        updateFields.avtar=avtar?.secure_url;
    }
    const {accessToken,refreshToken}=await generateTokens(user._id);
    const updatedUser=await User.findByIdAndUpdate(req.user?._id,
        {$set:updateFields},
        {new:true,select:("-password -refreshToken"),runValidators:true}
    );

    // //console.log("updatedUser")
    // //console.log(updatedUser)

    res.status(200).json(new APIResponse(200,{user:updatedUser,accessToken},"updated successfully",true));

}





//------------GET USER BY ID------------



async function getUserById(req,res,next){
    const _id=req.params._id;
    //console.log(_id)
    //console.log(req.user._id)
    if(!_id)
        throw new APIError(400,"please provide a valid id","invalid id");
    let user;
    if(req.user._id.equals(new mongoose.Types.ObjectId(_id)))
    user=await User.findById(_id).select("-password ")
    // user=await User.findById(_id).select("-password ").populate({path:"articles._id",model:"Article"});
    else
    user=await User.findById(_id).select("-password -refreshToken -mobileNo");

    if(!user)
        throw new APIError(404,"please provide a valid id","invalid id no user found");

    res.status(200).json(new APIResponse(200,user,"user found"));
}




// -----------CHANGE PASSWORD-----------



async function changePassword(req,res,next){
    let {oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword)
        throw new APIError(401,"required both old and new password","incomplete details");

    if(!req.user?._id)
        throw new APIError(401,"user is not logged in","unauthorized access");

    let user=await User.findById(req.user._id);
    let isPasswordCorrect=await user.isPasswordCorrect(oldPassword);
    //console.log("isPasswordCorrect:",isPasswordCorrect)
    if(!isPasswordCorrect)
        throw new APIError(401,"invalid credentials","incorrect password");

    user.password=newPassword;
    await user.save();

    res.status(200).json(new APIResponse(200,{},"password changed successfully",true));
}



//------------ LOGOUT USER-------------



async function logOut(req,res,next){
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            accessToken:""
        },
    })
    const options={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new APIResponse(200,{},"logged out successfully"));
}




//------------ GENERATE TOKENS-------------



const generateTokens=async function(userId){
    
    const user=await User.findById(userId);
    if(user){
    const accessToken=await user?.generateAccessToken();
    const refreshToken=await user?.generateRefreshToken();
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
    }
}




//------------ REFRESHTOKEN-------------




const refreshAccessToken=AsyncHandler(async (req,res,next)=>{
    const incomingAccessToken=req.cookies.refreshAccessToken || req.body.refreshAccessToken || req.header("refreshAccessToken")

    if(!incomingAccessToken)
        throw new APIError(402,"unauthorized access","required refresh token to start session again")

    const decodedToken=await jwt.verify(incomingAccessToken,process.env.JWT_SECRET);

    if(!decodedToken)
        throw new APIError(402,"unauthorized access","invalid token may be expired token");

    const user=User.findById(decodedToken._id).select("-password");

    if(!user)
        throw new APIError(402,"unauthorized access","invalid token may be expired token");

    const {accessToken,refreshToken}=await generateTokens(user._id);
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});

    const cookieOption={
        httpOnly:true,
        secure:true
    }

    res.status(200).
    cookie("accessToken",accessToken,cookieOption).
    cookie("refreshToken",refreshToken,cookieOption).
    json(new APIResponse(200,user,"successfully started session again",true));
})
module.exports = {registerUser,logInUser,logOut,refreshAccessToken,updateUser,changePassword,getUserById};