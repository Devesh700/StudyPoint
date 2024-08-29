const mongoose=require("mongoose");
const SkillTitleSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid title title must be a string your provided input${props.value}`
        }
    },
    subTitle:{
        type:[
            {
            type:String,
            validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:(props)=>`please enter a valid title title must be a string your provided input${props.value}`
            }
        }
        ],
        required:true,
        
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    topics:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Topic"
            }
        ]
    },
    // subTitles:{
    //     type:[
    //         {
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:"SubTitle"
    //         }
    //     ]
    // }
},{timestamps:true});

module.exports=mongoose.model("SkillTitle",SkillTitleSchema);