var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
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
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'answer' }
} , {
    timestamps: true
})

module.exports = mongoose.model("comment", commentSchema);
