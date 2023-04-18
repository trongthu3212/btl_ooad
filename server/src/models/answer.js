var mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

var answerSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' }
} , {
    timestamps: true
})

answerSchema.plugin(mongooseLeanVirtual)

module.exports = mongoose.model("answer", answerSchema);
