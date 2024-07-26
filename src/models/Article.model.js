const mongoose=require("mongoose");
const ArticleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title field required"]
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true,"author field required"]
    },
    content:{
        type:String,
        required:[true,"content field required"]
    }
},{timestamps:true});
module.exports=mongoose.model("Article",ArticleSchema);