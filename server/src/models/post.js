var mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    content: {
        type: String,
        required: true
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

postSchema.plugin(aggregatePaginate)
postSchema.plugin(mongooseLeanVirtual)
postSchema.index({ content: "text", title: "text" })

module.exports = mongoose.model("post", postSchema);
