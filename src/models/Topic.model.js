const mongoose = require("mongoose");

const TopicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[a-zA-Z\s'`]+$/.test(v),
            message: (props) => `Please enter a valid topic name. Your provided input: ${props.value}`
        }
    },
    file: {
        type: String
    },
    links: [{
        label: String,
        value: String
    }],
    content: {
        type: []
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic" // Allows nesting topics
    }]
}, { timestamps: true });

module.exports = mongoose.model("Topic", TopicSchema);
