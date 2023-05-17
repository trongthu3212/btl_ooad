var mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

var answerSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    accepted: {
        type: Boolean,
        default: false
    }
} , {
    timestamps: true
})

answerSchema.plugin(mongooseLeanVirtual)
answerSchema.index({ content: "text" })

module.exports = mongoose.model("answer", answerSchema);
