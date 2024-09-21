const mongoose = require("mongoose");

const SkillTitleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[a-zA-Z\s'`]+$/.test(v),
            message: (props) => `Please enter a valid title. Your provided input: ${props.value}`
        }
    },
    subTitle: [
        {
        name:String,
        Topics:[
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Topic",
                },
                name:String
            }
        ]
    },
        {
        name:String,
        Topics:[
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Topic",
                },
                name:String
            }
        ]
    },
        {
        name:String,
        Topics:[
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Topic",
                },
                name:String
            }
        ]
    },
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("SkillTitle", SkillTitleSchema);
