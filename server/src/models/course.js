var mongoose = require("mongoose");
var mongoosePagination = require("mongoose-paginate-v2")

var courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true,
        index: true
    }
} , {
    timestamps: true
})

courseSchema.plugin(mongoosePagination)
courseSchema.index({ code: "text", name: "text" });

module.exports = mongoose.model("course", courseSchema);
