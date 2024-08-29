const mongoose=require("mongoose");
const SubTopicSchmea=mongoose.Schema({
    name:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid title title must be a string your provided input${props.value}`
        }
    },
    files:{
        type:String
    },
    link:{
        type:{
        label:String,
        value:String
        }
    },
    content:{
        type:String,
        validate:{
            validator:(v)=>/^[a-zA-Z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid content , content must be a string your provided input${props.value}`
        }
    },
    subTopics:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"SubTopic"
            }
        ]
    }
},{timestamps:true});
module.exports=mongoose.model("SubTopic",SubTopicSchmea);