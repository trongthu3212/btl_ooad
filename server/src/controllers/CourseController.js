var courseModel = require('../models/course');

// For testing purpose
async function addCourse(req, res) {
    let courseName = req.body.name;
    let courseCode = req.body.code;

    var course = new courseModel({
        name: courseName,
        code: courseCode
    });

    await course.save()
        .then(course => { res.json({ courseId: course._id }); })
        .catch(err => { res.json({ error: err })});
}

module.exports = {
    addCourse: addCourse
};