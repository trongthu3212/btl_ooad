var courseModel = require('../models/course');
var enrollModel = require('../models/enroll')
var commonPopulators = require('../controllers/CommonPopulators')

async function addCourse(req, res) {
    let courseName = req.body.name;
    let courseCode = req.body.code;

    let courseFound = await courseModel.findOne({ code: courseCode });
    
    if (courseFound) {
        res.status(409).json({ error: "The error already existed!" });
        return;
    }

    var course = new courseModel({
        name: courseName,
        code: courseCode
    });

    await course.save()
        .then(course => { res.json({ courseId: course._id }); })
        .catch(err => { res.json({ error: err })});
}

async function getAllCourses(req, res) {
    let page = req.query.page;
    let coursePerPage = req.query.quantity;

    if ((page <= 0) || (coursePerPage <= 0)) {
        res.status(400).send({ message: 'Page must be larger then 0!' });
    } else {
        // Pagination system based on offset 0
        page -= 1;

        let options = {
            offset: page * coursePerPage,
            limit: coursePerPage,
            select: 'code name',
            lean: true,
            sort: { _id: 'desc' }       // Id compare by creation date!
        }

        const globalCourseCount = await courseModel.estimatedDocumentCount()
    
        await courseModel.paginate({}, options)
            .then(courses => res.json({ courses: courses.docs, globalCourseCount: globalCourseCount }))
            .catch(err => res.status(500).json({ error: err }));
    }
}

async function getParticipateCourses(req, res) {
    let { id } = req.params
    
    await enrollModel.find({ user: id })
        .select('course')
        .populate(commonPopulators.userListCoursesPopulators)
        .then(courses => res.json({ courses: courses, courseCount: courses.length }))
        .catch(err => res.status(500).json({ error: err }));
}

async function enrollCourse(req, res) {
    let courseId = req.body.courseId
    let userId = req.body.userId

    // TODO: Add permission!

    let existingEnroll = await enrollModel.findOne({ user: userId, course: courseId })
        .catch(err => res.sendStatus(500).json({ error: err }));

    if (existingEnroll) {
        res.sendStatus(409).json({ error: 'You already enrolled to this course!' })
        return;
    }

    let enrollNew = new enrollModel({
        user: userId,
        course: courseId
    });

    await enrollNew.save()
        .then(enroll => res.sendStatus(200))
        .catch(err => { res.sendStatus(500).json({ error: err })});
}

async function leaveCourse(req, res) {
    let courseId = req.body.courseId
    let userId = req.body.userId

    // TODO: Add permission!

    let existingEnroll = await enrollModel.findOne({ user: userId, course: courseId })
        .catch(err => res.sendStatus(500).json({ error: err }));

    if (!existingEnroll) {
        res.sendStatus(200);
        return;
    }

    await enrollModel.deleteOne({ "_id": existingEnroll._id })
        .then(post => { res.sendStatus(200) })
        .catch(err => { res.json({ error: err })});
}

async function suggestCourses(req, res) {
    let keyword = req.body.keyword
    let limit = req.body.limit

    await courseModel.find({
        $or: [
            { "code": { $regex: '.*' + keyword + '.*', $options: 'i' } },
            { "name": { $regex: '.*' + keyword + '.*', $options: 'i' } },
            { $text: { $search: keyword, $caseSensitive: false, $diacriticSensitive: false } }
    ]}).limit(limit)
        .then(courses => res.json({ courses: courses }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    addCourse: addCourse,
    getAllCourses: getAllCourses,
    getParticipateCourses: getParticipateCourses,
    enrollCourse: enrollCourse,
    leaveCourse: leaveCourse,
    suggestCourses: suggestCourses
};