var mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

var commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'answer' }
} , {
    timestamps: true
})

commentSchema.plugin(mongooseLeanVirtual)
commentSchema.index({ content: "text" });

module.exports = mongoose.model("comment", commentSchema);

