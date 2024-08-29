const mongoose=require("mongoose");
const SkillSubTitleSchema=mongoose.Schema({
    subTitle:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid title title must be a string your provided input${props.value}`
        }
    },
    topics:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Topic"
            }
        ]
    }
},{timestamps:true});
module.exports=mongoose.model("SubTitle",SkillSubTitleSchema);