var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')
var roleConsts = require('../consts/role')

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
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
userSchema.post(['find', 'findOne', 'getById'], result => {
    if ((result == undefined) || (result == null)) {
        return result;
    }
    if ((result.role == undefined) || (result.role == null)) {
        Object.defineProperty(result, 'role', {
            value: roleConsts.NORMAL_USER_PERMISSIONS,
            writable: false
        });
    } else {
        result.role = roleConsts.getRoleByName(result.role);
    }
    return result;
});

module.exports = mongoose.model("user", userSchema)