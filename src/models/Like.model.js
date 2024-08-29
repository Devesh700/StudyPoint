const mongoose=require("mongoose");
const likeSchema=mongoose.Schema({
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    articleName:{
        type:String,
        required:true
    },
    article:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})
module.exports=mongoose.model("Like",likeSchema);