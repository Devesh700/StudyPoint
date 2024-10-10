const Comment=require("../models/Comment.model")
const uploadToCloudinary=require("../../utils/Cloudinary");

const { APIError,APIResponse } = require("../../utils/Handlers");
const User=require("../models/User.model");
const { default: mongoose } = require("mongoose");
const Article = require("../models/Article.model");
const Like=require("../models/Like.model");


const addLike=async function (req,res,next){
    if(!req?.user || !req?.user?._id || !req.user?.fullName){
        throw new APIError(400,"log in to continue","unauthorzed access");
    }

    const {articleId,title}=req?.body;
    // console.log(articleId)
    if(!articleId || !title){
        throw new APIError(400,"no post found","invalid post");
    }

        let like=await Like.find({
        $and:[{likedBy:req.user._id},{articleId:articleId}]
        })
        // console.log(like)
    if(like?.length>0){
        throw new APIError(401,"unknown error occured","databse error");
    }

    let article=await Article.findById({_id:articleId});
    if(!article){
        throw new APIError(400,"no post found","invalid post");
    }
    // console.log(article);

        like=await Like.create({
        likedBy:req.user._id,
        userName:req.user.fullName,
        articleId:article._id,
        articleName:article.title

    })

    like=await Like.findById(like._id);
    if(!like){
        throw new APIError(401,"unknown error occured","databse error");
    }

    let likes=[...article.likes];
    likes.push(like._id);

    article=await Article.findByIdAndUpdate(articleId,{
        $set:{likes:likes}
    },{new:true}).populate('likes')

    if(!article){
        throw new APIError(401,"invalid article","article not found");
    }
    res.json(article);
}








const removeLike=async function (req,res,next){
    if(!req?.user || !req?.user?._id || !req.user?.fullName){
        throw new APIError(400,"log in to continue","unauthorzed access");
    }

    const {articleId,title}=req?.body;  //article id and title
    // console.log("remove",articleId);

    if(!articleId || !title){
        throw new APIError(400,"no post found","invalid post");
    }

    let article=await Article.findById({_id:articleId});
    if(!article){
        throw new APIError(400,"no post found","invalid post");
    }

    let like=await Like.find({
        $and:[{likedBy:req.user._id},{articleId:articleId}]
        })
        like=like[0];
    if(!like){
        throw new APIError(401,"unknown error occured","databse error");
    }

    like=await Like.findByIdAndDelete(like._id);

    if(!like){
        throw new APIError(401,"unknown error occured","databse error");
    }

    let likes=[...article.likes];
    likes=likes.filter(elem=>elem._id!==like._id);

    article=await Article.findByIdAndUpdate({_id:articleId},{
        $set:{likes:likes}
    },{new:true}).populate('likes')
    // console.log("likes removed from article",article);
    if(!article){
        throw new APIError(401,"invalid article","article not found");
    }
    res.json(article);
}









const handleBatchOfLikes=async function(req,res,next){
    
}

module.exports={addLike,removeLike};