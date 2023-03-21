var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' }
} , {
    timestamps: true
})

module.exports = mongoose.model("answer", answerSchema);
