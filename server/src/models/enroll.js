var mongoose = require('mongoose');

var enrollSchema = mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, {
    timestamps: true
})

module.exports = mongoose.model("enroll", enrollSchema)