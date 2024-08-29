const mongoose=require("mongoose");
const ArticleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title field required"]
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"author field required"]
    },
    description:{
        type:String,
        required:[true,"content field required"]
    },
    likes:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Like"
            }
        ]
    },
    comments:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ]
    },
    post:{
        type:String,
        default:undefined
    }
},{timestamps:true});
module.exports=mongoose.model("Article",ArticleSchema);