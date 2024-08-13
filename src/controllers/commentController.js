const Comment=require("../models/Comment.model")
const uploadToCloudinary=require("../../utils/Cloudinary");

const { APIError,APIResponse } = require("../../utils/Handlers");
const User=require("../models/User.model");
const { default: mongoose } = require("mongoose");
const Article = require("../models/Article.model");


// ------------ADD COMMENT--------------



const addComment=async function(req,res,next){
    let commentedBy=req.user._id;
    if(!commentedBy)
        throw new APIError(400,"unauthorized user","unauthorized access log in again");

    const {postId,comment}=req.body;

    if(!postId || !comment)
        throw new APIError(401,"postId and comment required","incomplete data");

    const commentData=await Comment.create({
        commentedBy,
        comment,
        postId
    })

    const createdComment=await Comment.findById(commentData._id);
    if(!createdComment)
        throw new APIError(401,"error add your comment","failed");

    res.status(200).json(200,createdComment,"comment added successfully",true);
}




// ----------- EDIT COMMENT--------------




const editComment=async function(req,res,next){
    
    const _id=req.params._id;
 
    const {comment}=req.body;

    if(!_id)
        throw new APIError(400,"comment id not found in url","id not found");

    if(!req.user || !req.user._id)
        throw new APIError(400,"invalid user","unauthorized access");


    const commentData=await Comment.findById(_id);

    if(!commentData)
        throw new APIError(400,"no comment found related to id provided","comment not found");
    
    let updatedComment;
    if(comment!=undefined){
        updatedComment=await Comment.findByIdAndUpdate(_id,{
        $set:{comment:comment}
    },{new:true})
    }

    res.status(200).json(new APIResponse(200, updatedComment, "comment updated successfully"));
    
}




// -----------DELETE COMMENT----------------




const deleteComment=async function(req,res,next){
    const commentId=req.params._id;
    const userId=req.user?._id;

    if(!commentId)
        throw new APIError(400,"id not found in url","id not found");

    if(!userId)
        throw new APIError(400,"invalid user","unauthorized access");

    const commentData=await Comment.findById(commentId);
    if(!commentData)
        throw new APIError(400,"invalid comment id","no comment found");

    const postId=commentData?.postId;

    if(!postId)
        throw new APIError(400,"invalid comment","no comment found");

    const article=await Article.findById(postId);

    if(!article)
        throw new APIError(400,"invalid comment ","no article found related to this comment");

    let commentsInArticle=[...article.comments];
    if(!commentsInArticle)
        throw new APIError(400,"no comment available at this post","invalid access");

    const deletedComment=await Comment.findByIdAndDelete(commentData._id)
    console.log(deletedComment);
    if(!deletedComment)
        throw new APIError(400,"unknown error occured while deleting comment","database error");

    commentsInArticle=commentsInArticle.filter(elem=>elem!=commentData._id);

    const updatedPost=Article.findByIdAndUpdate(postId,{
        $set:{comments:commentsInArticle}
    },{new:true})

    res.status(200).json(new APIResponse(200,updatedPost,"comment deleted"));
}




// --------------GET ALL COMMENTS ON SPECIFIC POST-------------



async function getAllComment(req,res,next){
    let _id=req.user?._id;
    console.log(req.user);
    console.log(_id, typeof(_id));
    if(!_id ){
        throw new APIError(400,"log in to fetch comments","unauthorized access")
    }
    let comment=await Comment.find({postedBy:_id});
    res.status(200).json(new APIResponse(200,comment,"all comments fetched successfully",true))
}


module.exports={addComment,editComment,deleteComment,getAllComment}