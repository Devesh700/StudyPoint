const jwt=require("jsonwebtoken")
const { AsyncHandler, APIError, APIResponse } = require("../../utils/Handlers");
const uploadToCloudinary = require("../../utils/Cloudinary");
const TopicModel = require("../models/Topic.model");




// GET Topic



const getTopic=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let id=req.params.id;
    if(!id)
        throw new APIError(400,"required id","invalid access");

    let Topic=await TopicModel.findById(id);
    if(!Topic)
        throw new APIError(400,"no Topic found by this id","provide a valid id of Topic");

    res.status(200).json(new APIResponse(200,Topic,"successfully fetched"))
}




// CREATE Topic



const CreateTopic=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let {name,subTopics,content,links}=req.body;
    let filepath=req.file?req.file.path:undefined;
    let file;
    if(filepath)
        file=await uploadToCloudinary(filepath);

    if(filepath && !file)
        throw new APIError(400,"unknown error occured while uploading file","try again uploading your file or try uploading file later")
    file=file?.secure_url || "";
    let postedBy=req.user._id;
    let topicData={name,subTopics,content,links,file,postedBy};
    // console.log(title,subTitle,postedBy)

    let Topic=await TopicModel.create(topicData)

    Topic=await TopicModel.findById(Topic?._id);
    if(!Topic)
        throw new APIError(400,"error creating skill title","unknown error occured while database creation try again")

    return res.status(200).json(new APIResponse(200,Topic,"successfully created"));
}



// UPDATE Topic



const updateTopic=async function(req,res,next){
    if(!req?.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

     let {name,subTopics,content,links}=req.body;
    let filepath=req.file?req.file.path:undefined;
    let file;
    if(filepath)
        file=await uploadToCloudinary(filepath);

    if(filepath && !file)
        throw new APIError(400,"unknown error occured while uploading file","try again uploading your file or try uploading file later")
    file=file?.secure_url || "";
    let topicData={name,subTopics,content,links,file};

    let id=req.params?.id
    if(!id)
        throw new APIError(400,"required id of topic","invalid access");

    let Topic=await TopicModel.findById(id);
    if(!Topic)
        throw new APIError(400,"no Topic found by this id","provide a valid id of Topic");

    if(name)
        Topic.name=name;
    if(content)
        Topic.content=content;
    if(subTopics)
        Topic.subTopics=subTopics;
    if(links)
        Topic.links=links;
    if(file!=="")
        Topic.file=file;

    const updatedTopic=await TopicModel.findByIdAndUpdate(id,
        {$set:Topic},
        {new:true}
    )

    if(!updatedTopic)
        throw new APIError(400,"error updating skill title","unknown error occured while database creation try again")

    res.status(200).json(new APIResponse(200,updatedTopic,"successfully updated"))
}




// DELETE Topic



const deletTopic=async function(req,res,next){
    if(!req?.user || !req.user?._id)
        throw new APIError(400,"unauthorized access","unauthorized access");

    let id=req.params?.id
    if(!id)
        throw new APIError(400,"required id","invalid access");

    let Topic=await TopicModel.findByIdAndDelete(id);

    if(!Topic)
        throw new APIError(400,"no such skill title found","invalid id")

    const deletedTopic=await TopicModel.findById(Topic?._id,{new:true});
    if(deletedTopic)
        throw new APIError(400,"error deleting skill title","unknown error occured while document entry deletion try again")

    return res.status(200).json(new APIResponse(200,Topic,"successfully deleted"));
}



// GET ALL



async function getAllTopic(req,res,next){
    let _id=req.user?._id;
    if(!_id ){
        throw new APIError(400,"log in to fetch articles","unauthorized access")
    }
    let Topic=await TopicModel.find({postedBy:_id});
    res.status(200).json(new APIResponse(200,Topic,"all Topics fetched successfully",true))
}



// POPULATE ALL




async function populateAllTopic(req,res,next){
    
    let Topic=await TopicModel.find({});
    res.status(200).json(new APIResponse(200,Topic,"all Topics fetched successfully",true))
}


module.exports={getTopic,CreateTopic,updateTopic,deletTopic,getAllTopic,populateAllTopic};