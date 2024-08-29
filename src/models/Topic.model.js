const mongoose=require("mongoose");
const TopicSchmea=mongoose.Schema({
    name:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid title title must be a string your provided input${props.value}`
        }
    },
    file:{
        type:String
    },
    links:{
        type:{
        label:String,
        value:String
        }
    },
    content:{
        type:String,
        
    },
     postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subTopics:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Topic"
            }
        ]
    }
},{timestamps:true});
module.exports=mongoose.model("Topic",TopicSchmea);