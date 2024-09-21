const jwt = require("jsonwebtoken");
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");
const TopicModel = require("../models/Topic.model");
const SkillSubTitleModel = require("../models/SkillSubTitle.model");
const SkillTitleModel = require("../models/SkillTitle.model");

// GET Topic
const getTopic = async function(req, res, next) {
    // if (!req?.user || !req.user._id)
    //     throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let id = req.params.id;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let topic = await TopicModel.findById(id).populate('subTopics');
    if (!topic)
        throw new APIError(400, "No topic found by this ID", "Provide a valid ID of topic");

    res.status(200).json(new APIResponse(200, topic, "Successfully fetched"));
}

// CREATE Topic
const CreateTopic = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { name,  content, links,titleId,level } = req.body;
    let filepath = req.file ? req.file.path : undefined;
    let file;
    if (filepath)
        file = await uploadToCloudinary(filepath);

    if (filepath && !file)
        throw new APIError(400, "Unknown error occurred while uploading file", "Try again uploading your file or try uploading file later");

    file = file?.secure_url || "";
    let postedBy = req.user._id;
    let topicData = {  postedBy };
    if(name){topicData.name=name}
    if(content){topicData.content=content}
    if(file){topicData.file=file}

    console.log("topicData: ",topicData)

    let topic = await TopicModel.create(topicData);

    topic = await TopicModel.findById(topic?._id).populate('subTopics');
    if (!topic)
        throw new APIError(400, "Error creating topic", "Unknown error occurred while database creation, try again");

    let Title=await SkillTitleModel.findById(titleId);
    console.log(Title);
    let prevSubtitleTopics=[...Title.subTitle];
    console.log("level ",level);
    prevSubtitleTopics=prevSubtitleTopics.filter(subtitle=>subtitle.name===level.value)[0];
    console.log("prevsubtitletopics",prevSubtitleTopics);
    prevSubtitleTopics=[...prevSubtitleTopics.Topics];
    let updatedSubtitleTopics=[...prevSubtitleTopics,{id:topic._id,name:topic.name}];
    let updatedSubTitle=Title.subTitle?.map(subtitle=>{
        if(subtitle.name===level.value){
            return {name:level.value,Topics:subtitle.Topics=updatedSubtitleTopics}
        }
        return subtitle
    })
    console.log("updated subtitle: ",[...updatedSubTitle])
    console.log("updated subtitleTopics: ",[...updatedSubTitle[0].Topics])
    console.log("title subtitle: ",Title.subTitle)
    Title.subTitle=updatedSubTitle;
    await Title.save();
    console.log("title: ",Title.subTitle);


    return res.status(200).json(new APIResponse(200, topic, "Successfully created"));
}

// UPDATE Topic
const updateTopic = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let { name, subTopics, content, links } = req.body;
    let filepath = req.file ? req.file.path : undefined;
    let file;
    if (filepath)
        file = await uploadToCloudinary(filepath);

    if (filepath && !file)
        throw new APIError(400, "Unknown error occurred while uploading file", "Try again uploading your file or try uploading file later");

    file = file?.secure_url || "";
    let topicData = { name, subTopics, content, links, file };

    let id = req.params?.id;
    if (!id)
        throw new APIError(400, "Required ID of topic", "Invalid access");

    let topic = await TopicModel.findById(id);
    if (!topic)
        throw new APIError(400, "No topic found by this ID", "Provide a valid ID of topic");

    if (name) topic.name = name;
    if (content) topic.content = content;
    if (subTopics) topic.subTopics = subTopics;
    if (links) topic.links = links;
    if (file !== "")
        topic.file = file;

    const updatedTopic = await TopicModel.findByIdAndUpdate(id, { $set: topic }, { new: true }).populate('subTopics');

    if (!updatedTopic)
        throw new APIError(400, "Error updating topic", "Unknown error occurred while database update, try again");

    res.status(200).json(new APIResponse(200, updatedTopic, "Successfully updated"));
}

// DELETE Topic
const deleteTopic = async function(req, res, next) {
    if (!req?.user || !req.user._id)
        throw new APIError(400, "Unauthorized access", "Unauthorized access");

    let {id,subTitleId} = req.params;
    if (!id)
        throw new APIError(400, "Required ID", "Invalid access");

    let subTitle=await SkillSubTitleModel.findById(subTitleId)
    if(!subTitle)
        throw new APIError(400, "No such subTitle found", "Invalid subTitleId");

    let topics=[...subTitle.topics];
    topics=topics.filter(topicId=>topicId!=id);

    let updatedSubTitle=await SkillSubTitleModel.findByIdAndUpdate(subTitleId,{$set:{topics:topics}});
    if(!updatedSubTitle)
        throw new APIError(400, "databse error", "Invalid subTitleId");

    let topic = await TopicModel.findByIdAndDelete(id);
    if (!topic)
        throw new APIError(400, "No such topic found", "Invalid ID");


    return res.status(200).json(new APIResponse(200, topic, "Successfully deleted"));
}

// GET ALL
async function getAllTopic(req, res, next) {
    let _id = req.user?._id;
    if (!_id)
        throw new APIError(400, "Log in to fetch topics", "Unauthorized access");

    let topics = await TopicModel.find({ postedBy: _id }).populate('subTopics');
    res.status(200).json(new APIResponse(200, topics, "All topics fetched successfully", true));
}

// POPULATE ALL
async function populateAllTopic(req, res, next) {
    let topics = await TopicModel.find({}).populate('subTopics');
    res.status(200).json(new APIResponse(200, topics, "All topics fetched successfully", true));
}

module.exports = { getTopic, CreateTopic, updateTopic, deleteTopic, getAllTopic, populateAllTopic };













































// const jwt=require("jsonwebtoken")
// const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
// const uploadToCloudinary = require("../../utils/Cloudinary");
// const TopicModel = require("../models/Topic.model");




// // GET Topic



// const getTopic=async function(req,res,next){
//     if(!req?.user || !req.user._id)
//         throw new APIError(400,"unauthorized access","unauthorized access");

//     let id=req.params.id;
//     if(!id)
//         throw new APIError(400,"required id","invalid access");

//     let Topic=await TopicModel.findById(id);
//     if(!Topic)
//         throw new APIError(400,"no Topic found by this id","provide a valid id of Topic");

//     res.status(200).json(new APIResponse(200,Topic,"successfully fetched"))
// }




// // CREATE Topic



// const CreateTopic=async function(req,res,next){
//     if(!req?.user || !req.user._id)
//         throw new APIError(400,"unauthorized access","unauthorized access");

//     let {name,subTopics,content,links}=req.body;
//     let filepath=req.file?req.file.path:undefined;
//     let file;
//     if(filepath)
//         file=await uploadToCloudinary(filepath);

//     if(filepath && !file)
//         throw new APIError(400,"unknown error occured while uploading file","try again uploading your file or try uploading file later")
//     file=file?.secure_url || "";
//     let postedBy=req.user._id;
//     let topicData={name,subTopics,content,links,file,postedBy};
//     // console.log(title,subTitle,postedBy)

//     let Topic=await TopicModel.create(topicData)

//     Topic=await TopicModel.findById(Topic?._id);
//     if(!Topic)
//         throw new APIError(400,"error creating skill title","unknown error occured while database creation try again")

//     return res.status(200).json(new APIResponse(200,Topic,"successfully created"));
// }



// // UPDATE Topic



// const updateTopic=async function(req,res,next){
//     if(!req?.user || !req.user._id)
//         throw new APIError(400,"unauthorized access","unauthorized access");

//      let {name,subTopics,content,links}=req.body;
//     let filepath=req.file?req.file.path:undefined;
//     let file;
//     if(filepath)
//         file=await uploadToCloudinary(filepath);

//     if(filepath && !file)
//         throw new APIError(400,"unknown error occured while uploading file","try again uploading your file or try uploading file later")
//     file=file?.secure_url || "";
//     let topicData={name,subTopics,content,links,file};

//     let id=req.params?.id
//     if(!id)
//         throw new APIError(400,"required id of topic","invalid access");

//     let Topic=await TopicModel.findById(id);
//     if(!Topic)
//         throw new APIError(400,"no Topic found by this id","provide a valid id of Topic");

//     if(name)
//         Topic.name=name;
//     if(content)
//         Topic.content=content;
//     if(subTopics)
//         Topic.subTopics=subTopics;
//     if(links)
//         Topic.links=links;
//     if(file!=="")
//         Topic.file=file;

//     const updatedTopic=await TopicModel.findByIdAndUpdate(id,
//         {$set:Topic},
//         {new:true}
//     )

//     if(!updatedTopic)
//         throw new APIError(400,"error updating skill title","unknown error occured while database creation try again")

//     res.status(200).json(new APIResponse(200,updatedTopic,"successfully updated"))
// }




// // DELETE Topic



// const deletTopic=async function(req,res,next){
//     if(!req?.user || !req.user?._id)
//         throw new APIError(400,"unauthorized access","unauthorized access");

//     let id=req.params?.id
//     if(!id)
//         throw new APIError(400,"required id","invalid access");

//     let Topic=await TopicModel.findByIdAndDelete(id);

//     if(!Topic)
//         throw new APIError(400,"no such skill title found","invalid id")

//     const deletedTopic=await TopicModel.findById(Topic?._id,{new:true});
//     if(deletedTopic)
//         throw new APIError(400,"error deleting skill title","unknown error occured while document entry deletion try again")

//     return res.status(200).json(new APIResponse(200,Topic,"successfully deleted"));
// }



// // GET ALL



// async function getAllTopic(req,res,next){
//     let _id=req.user?._id;
//     if(!_id ){
//         throw new APIError(400,"log in to fetch articles","unauthorized access")
//     }
//     let Topic=await TopicModel.find({postedBy:_id});
//     res.status(200).json(new APIResponse(200,Topic,"all Topics fetched successfully",true))
// }



// // POPULATE ALL




// async function populateAllTopic(req,res,next){
    
//     let Topic=await TopicModel.find({});
//     res.status(200).json(new APIResponse(200,Topic,"all Topics fetched successfully",true))
// }


// module.exports={getTopic,CreateTopic,updateTopic,deletTopic,getAllTopic,populateAllTopic};