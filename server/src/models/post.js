var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    content: {
        type: String,
        required: true
    }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } 
} , {
    timestamps: true
})

module.exports = mongoose.model("post", postSchema);
