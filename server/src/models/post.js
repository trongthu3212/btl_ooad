var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    title: String,
    content: String,
    postID: {
        type: String, 
        unique: true,
        require: true
    } 
} , {
    timestamps: true
})

module.exports = mongoose.model("post", postSchema);
