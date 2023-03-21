var mongoose = require("mongoose");
var mongoosePagination = require("mongoose-paginate-v2")

var courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
} , {
    timestamps: true
})

courseSchema.plugin(mongoosePagination)

module.exports = mongoose.model("course", courseSchema);
