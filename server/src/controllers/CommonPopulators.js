module.exports = {
    postPopulators: [
        { path: 'author', select: 'username name avatar' },
        { path: 'course', select: 'name code' }
    ],
    answerPopulators: [
        { path: 'author', select: 'username name avatar' }
    ],
    commentPopulators: [
        { path: 'author', select: 'username name' }
    ],
    userListCoursesPopulators: [
        { path: 'course', select: 'code name' }
    ]
}