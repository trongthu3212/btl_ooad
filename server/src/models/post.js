var mongoose = require("mongoose");
var mongoosePagination = require("mongoose-paginate-v2")

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    content: {
        type: String,
        required: true
    },
    shortDescription: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } 
} , {
    timestamps: true
})

postSchema.plugin(mongoosePagination)

module.exports = mongoose.model("post", postSchema);
