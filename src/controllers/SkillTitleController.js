const jwt=require("jsonwebtoken")
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");
const SkillTitleModel = require("../models/SkillTitle.model");




// GET SKILLTITLE



const getSkillTitle = async function(req, res, next) {
    // if (!req?.user || !req.user._id)
    //     throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let id = req.params.id;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let skillTitle = await SkillTitleModel.findById(id)
    if (!skillTitle)
        throw new APIError(400, "No skillTitle found by this ID", "Provide a valid ID of skillTitle");

    res.status(200).json(new APIResponse(200, skillTitle, "Successfully fetched"));
}





// CREATE SKILLTITLE



const CreateSkillTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { title} = req.body;
    console.log(title)
    let postedBy = req.user._id;

    if (!title)
        throw new APIError(401, "Title and subTitles are required", "Insufficient data");

    let skillTitle = await SkillTitleModel.create(
    { title, postedBy,
    subTitle:[{name:"Beginner",Topics:[]},
    {name:"Intermediate",Topics:[]},
    {name:"Advanced",Topics:[]}] });

    skillTitle = await SkillTitleModel.findById(skillTitle?._id);
    if (!skillTitle)
        throw new APIError(400, "Error creating skill title", "Unknown error occurred while database creation try again");

    return res.status(200).json(new APIResponse(200, skillTitle, "Successfully created"));
}




// UPDATE SKILLTITLE



const updateSkillTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { title, subTitle } = req.body;
    let id = req.params?.id;

    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let skillTitle = await SkillTitleModel.findById(id);
    if (!skillTitle)
        throw new APIError(400, "No skillTitle found by this ID", "Provide a valid ID of skillTitle");

    if (title) skillTitle.title = title;
    if (subTitle) {skillTitle.subTitle = subTitle};

    const updatedSkillTitle = await SkillTitleModel.findByIdAndUpdate(id, { $set: skillTitle }, { new: true })

    if (!updatedSkillTitle)
        throw new APIError(400, "Error updating skill title", "Unknown error occurred while database update try again");

    res.status(200).json(new APIResponse(200, updatedSkillTitle, "Successfully updated"));
}





// DELETE SKILLTITLE



const deletSkillTitle = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let id = req.params?.id;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let skillTitle = await SkillTitleModel.findByIdAndDelete(id);
    if (!skillTitle)
        throw new APIError(400, "No such skill title found", "Invalid ID");

    res.status(200).json(new APIResponse(200, skillTitle, "Successfully deleted"));
}




// GET ALL



const getAllSkillTitle = async function(req, res, next) {
    let _id = req.user?._id;
    if (!_id)
        throw new APIError(400, "Log in to fetch articles", "Unauthorized access");

    let skillTitles = await SkillTitleModel.find({ postedBy: _id })
    res.status(200).json(new APIResponse(200, skillTitles, "All skillTitles fetched successfully", true));
}




// POPULATE ALL




const populateAllSkillTItle = async function(req, res, next) {
    let skillTitles = await SkillTitleModel.find({})
    res.status(200).json(new APIResponse(200, skillTitles, "All skillTitles fetched successfully", true));
}



module.exports={getSkillTitle,CreateSkillTitle,updateSkillTitle,deletSkillTitle,getAllSkillTitle,populateAllSkillTItle};