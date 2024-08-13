const mongoose=require("mongoose");

const CommentSchema=mongoose.Schema({
    comment:{
        type:String,
        default:""
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Article"
    },
    reply:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ]
    }
},{timeStamps:true});
module.exports=mongoose.model("Comment",CommentSchema);