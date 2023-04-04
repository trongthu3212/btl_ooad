module.exports = {
    postPopulators: [
        { path: 'author', select: 'username name' },
        { path: 'course', select: 'name code' }
    ],
    answerPopulators: [
        { path: 'author', select: 'username name' }
    ],
    commentPopulators: [
        { path: 'author', select: 'username name' }
    ]
}