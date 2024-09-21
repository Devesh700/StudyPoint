const mongoose = require("mongoose");

const SubTitleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[a-zA-Z\s'`]+$/.test(v),
            message: (props) => `Please enter a valid subtitle. Your provided input: ${props.value}`
        }
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("SubTitle", SubTitleSchema);
