var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'answer' },
    vote: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("vote", voteSchema)