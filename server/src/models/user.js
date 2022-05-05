var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("user", userSchema)