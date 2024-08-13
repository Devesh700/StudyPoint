
const Article=require("../models/Article.model")
const uploadToCloudinary=require("../../utils/Cloudinary");

const { APIError,APIResponse } = require("../../utils/Handlers");
const User=require("../models/User.model");
const { default: mongoose } = require("mongoose");





// -----------GET ARTICLE BY ID--------------




 const getArticleById=async function(req,res,next){
    const _id=req.params._id;
    if(!_id)
        throw new APIError(400,"please provide a valid id","invalid id");

    const article=await Article.findById(_id);

    if(!article)
        throw new APIError(404,"please provide a valid id","invalid id no article found");

    res.status(200).json(new APIResponse(200,article,"article found"));
    
}




// -----------POST ARTICLE--------------





 const postArticle=async function(req,res,next){
    const {title,description}=req.body;

    if(!title || !description)
        throw new APIError(401,"title and description required","insufficient details")

    // console.log(req.file)
    // console.log(req.file.post)
    const postPath=req.file? req.file.path :undefined;
    // console.log("postPath",postPath)

    let post;
    if(postPath)
        post=await uploadToCloudinary(postPath);
        // console.log(post)
    const article=await Article.create({
        title,
        description,
        postedBy:req.user._id,
        post:post?.secure_url

    });

    if(!req.user || !req.user._id)
        throw new APIError(400,"unauthorized access","unauthorized access");
        const posts=req.user?.articles;
        if(!posts)
            posts=[];

        posts.push(article._id);
    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{
            articles:posts
        }
    })
    const createdArticle=await Article.findById(article._id);
    // console.log("article",article);
    // console.log("updatedarticle",createdArticle);
    if(!createdArticle)
        throw new APIError(404,"unknow error occured","failed while creating post");

    res.status(200).json(new APIResponse(200,createdArticle,"article successfully posted"))
}




// -----------EDIT ARTICLE--------------




const editArticle=async function(req,res,next){
    const _id=req.params._id;
    console.log(req.body);
    const {title,description}=req.body;
    if(!_id )
        throw new APIError(400,"id not found in url","id not found");

    if(!req.user || !req.user._id)
        throw new APIError(400,"invalid user","unauthorized access");


    const article=await Article.findById(_id);

    if(!article)
        throw new APIError(400,"no article found related to id provided","article not found");
    
    const postPath=req.file?req.file.path:undefined;
    let post;
    if(postPath)
        post=await uploadToCloudinary(postPath);

    let updatedData={};
    if(title!=undefined)
        updatedData.title=title;

    if(description!=undefined)
        updatedData.description=description;

    if(post!=undefined)
        updatedData.post=post?.secure_url;

    const updatedArticle=await Article.findByIdAndUpdate(_id,{
        $set:updatedData
    },{new:true})

    res.status(200).json(new APIResponse(200, updatedArticle, "article updated successfully"));
    
}





// -----------DELETE ARTICLE--------------




const deleteArticle=async function(req,res,next){
    const _id=req.params._id;
    if(!_id )
        throw new APIError(400,"id not found","required id of article you want to delete");

    if(!req.user || !req.user._id)
        throw new APIError(400,"invalid user","unauthorized access");

    const user=await User.findById(req.user._id);
    if(!user)
        throw new APIError(400,"invalid user","unauthorized access");

    console.log("old user",user);

    const article=await Article.findByIdAndDelete(_id);
    console.log(article);
    if(!article)
        throw new APIError(400,"failed to delete the article","unknown error occured");

    let articles=[...user.articles];
    articles=articles.filter(elem=>elem!=_id);

    const updatedUser=await User.findByIdAndUpdate(req.user._id,{$set:{articles:articles}},{new:true});
    console.log(updatedUser);

    res.status(200).json(new APIResponse(200,updatedUser,"deleted article successfully"));
}



// --------------GET ALL ARTICLE-------------



async function getAllArticle(req,res,next){
    let _id=req.user?._id;
    console.log(req.user);
    console.log(_id, typeof(_id));
    if(!_id ){
        throw new APIError(400,"log in to fetch articles","unauthorized access")
    }
    let article=await Article.find({postedBy:_id});
    res.status(200).json(new APIResponse(200,article,"all articles fetched successfully",true))
}




// --------------GET ALL ARTICLE-------------



async function populateAllArticle(req,res,next){
    
    let article=await Article.find({});
    res.status(200).json(new APIResponse(200,article,"all articles fetched successfully",true))
}

module.exports={getArticleById, postArticle, editArticle,deleteArticle,getAllArticle,populateAllArticle};