const jwt=require("jsonwebtoken")
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");
const SkillSubTitleModel = require("../models/SkillSubTitle.model");
const SkillTitleModel = require("../models/SkillTitle.model");




// GET SKILLSubTITLE



const getSkillSubTitle = async function(req, res, next) {
    // if (!req?.user || !req.user._id)
    //     throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let id = req.params.id;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let skillSubTitle = await SkillSubTitleModel.findById(id).populate('topics');
    if (!skillSubTitle)
        throw new APIError(400, "No skillSubTitle found by this ID", "Provide a valid ID of skillSubTitle");

    res.status(200).json(new APIResponse(200, skillSubTitle, "Successfully fetched"));
}





// CREATE SKILLSubTITLE



const CreateSkillSubTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { name} = req.body;
    let postedBy = req.user._id;

    if (!name)
        throw new APIError(401, "name and subTitles are required", "Insufficient data");

    let skillSubTitle = await SkillSubTitleModel.create({ name, postedBy });

    skillSubTitle = await SkillSubTitleModel.findById(skillSubTitle?._id);
    if (!skillSubTitle)
        throw new APIError(400, "Error creating skill title", "Unknown error occurred while database creation try again");

    return res.status(200).json(new APIResponse(200, skillSubTitle, "Successfully created"));
}




// UPDATE SKILLSubTITLE



const updateSkillSubTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { name, topics } = req.body;
    let id = req.params?.id;

    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let skillSubTitle = await SkillSubTitleModel.findById(id);
    if (!skillSubTitle)
        throw new APIError(400, "No skillSubTitle found by this ID", "Provide a valid ID of skillSubTitle");

    if (name) skillSubTitle.name = name;
    if (topics) skillSubTitle.topics = topics;

    const updatedSkillSubTitle = await SkillSubTitleModel.findByIdAndUpdate(id, { $set: skillSubTitle }, { new: true }).populate("topics")

    if (!updatedSkillSubTitle)
        throw new APIError(400, "Error updating skill title", "Unknown error occurred while database update try again");

    res.status(200).json(new APIResponse(200, updatedSkillSubTitle, "Successfully updated"));
}





// DELETE SKILLSubTITLE



const deletSkillSubTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let {id,titleId} = req.params;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let Title=await SkillTitleModel.findById(titleId)
    if(!Title)
        throw new APIError(400, "No such Title found", "Invalid TitleId");
        //console.log(Title)
    let subTitles=[...Title.subTitles];
    subTitles=subTitles.filter(subTitleId=>subTitleId!=id);

    let updatedTitle=await SkillTitleModel.findByIdAndUpdate(titleId,{$set:{subTitles:subTitles}});
    if(!updatedTitle)
        throw new APIError(400, "databse error", "Invalid subTitleId");

    let skillSubTitle = await SkillSubTitleModel.findByIdAndDelete(id);
    if (!skillSubTitle)
        throw new APIError(400, "No such skill title found", "Invalid ID");

    res.status(200).json(new APIResponse(200, skillSubTitle, "Successfully deleted"));
}




// GET ALL



const getAllSkillSubTitle = async function(req, res, next) {
    let _id = req.user?._id;
    if (!_id)
        throw new APIError(400, "Log in to fetch articles", "Unauthorized access");

    let skillSubTitles = await SkillSubTitleModel.find({ postedBy: _id }).populate('topics');
    res.status(200).json(new APIResponse(200, skillSubTitles, "All skillSubTitles fetched successfully", true));
}




// POPULATE ALL




const populateAllSkillSubTItle = async function(req, res, next) {
    let skillSubTitles = await SkillSubTitleModel.find({}).populate('topics');
    res.status(200).json(new APIResponse(200, skillSubTitles, "All skillSubTitles fetched successfully", true));
}



module.exports={getSkillSubTitle,CreateSkillSubTitle,updateSkillSubTitle,deletSkillSubTitle,getAllSkillSubTitle,populateAllSkillSubTItle};