const jwt=require("jsonwebtoken")
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");
const SkillTitleModel = require("../models/SkillTitle.model");




// GET SKILLTITLE



const getSkillTitle=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let id=req.params.id;
    if(!id)
        throw new APIError(400,"required id","invalid access");

    let SkillTitle=await SkillTitleModel.findById(id);
    if(!SkillTitle)
        throw new APIError(400,"no skillTitle found by this id","provide a valid id of skilltitle");

    res.status(200).json(new APIResponse(200,SkillTitle,"successfully fetched"))
}




// CREATE SKILLTITLE



const CreateSkillTitle=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let {title,subTitle}=req.body;
    let postedBy=req.user._id;
    console.log(title,subTitle,postedBy)

    if(!title || !subTitle)
        throw new APIError(401,"please provide title and subTitle both are required","insufficient data");

    let SkillTitle=await SkillTitleModel.create({title,subTitle,postedBy})

    SkillTitle=await SkillTitleModel.findById(SkillTitle?._id);
    if(!SkillTitle)
        throw new APIError(400,"error creating skill title","unknown error occured while database creation try again")

    return res.status(200).json(new APIResponse(200,SkillTitle,"successfully created"));
}



// UPDATE SKILLTITLE



const updateSkillTitle=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let {title,subTitle}=req.body;
    let id=req.params?.id
    if(!id)
        throw new APIError(400,"required id","invalid access");

    let SkillTitle=await SkillTitleModel.findById(id);
    if(!SkillTitle)
        throw new APIError(400,"no skillTitle found by this id","provide a valid id of skilltitle");

    if(title)
        SkillTitle.title=title;
    if(subTitle)
        SkillTitle.subTitle=subTitle;

    const updatedSkillTitle=await SkillTitleModel.findByIdAndUpdate(id,
        {$set:SkillTitle},
        {new:true}
    )

    if(!updatedSkillTitle)
        throw new APIError(400,"error updating skill title","unknown error occured while database creation try again")

    res.status(200).json(new APIResponse(200,updatedSkillTitle,"successfully updated"))
}




// DELETE SKILLTITLE



const deletSkillTitle=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let id=req.params?.id
    if(!id)
        throw new APIError(400,"required id","invalid access");

    let SkillTitle=await SkillTitleModel.findByIdAndDelete(id);

    if(!SkillTitle)
        throw new APIError(400,"no such skill title found","invalid id")

    const deletedSkillTitle=await SkillTitleModel.findById(SkillTitle?._id,{new:true});
    if(deletedSkillTitle)
        throw new APIError(400,"error deleting skill title","unknown error occured while document entry deletion try again")

    return res.status(200).json(new APIResponse(200,SkillTitle,"successfully deleted"));
}



// GET ALL



async function getAllSkillTitle(req,res,next){
    let _id=req.user?._id;
    if(!_id ){
        throw new APIError(400,"log in to fetch articles","unauthorized access")
    }
    let skillTitle=await SkillTitleModel.find({postedBy:_id});
    res.status(200).json(new APIResponse(200,skillTitle,"all skillTitles fetched successfully",true))
}



// POPULATE ALL




async function populateAllSkillTItle(req,res,next){
    
    let skillTitle=await SkillTitleModel.find({});
    res.status(200).json(new APIResponse(200,skillTitle,"all skillTitles fetched successfully",true))
}


module.exports={getSkillTitle,CreateSkillTitle,updateSkillTitle,deletSkillTitle,getAllSkillTitle,populateAllSkillTItle};