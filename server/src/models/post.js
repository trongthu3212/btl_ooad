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
    score: {
        type: Number,
        required: true,
        default: 0
    },
    view: {
        type: Number,
        required: true,
        default: 0
    },
    shortDescription: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course' }
} , {
    timestamps: true
})

postSchema.plugin(mongoosePagination)

module.exports = mongoose.model("post", postSchema);
