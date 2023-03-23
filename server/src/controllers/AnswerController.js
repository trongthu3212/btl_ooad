var answerModel = require('../models/answer');

async function addAnswer(req, res) {
    let postId = req.body.postId
    let content = req.body.content

    var answer = new answerModel({
        post: postId,
        content: content,
        author: req.user._id
    });

    await answer.save()
        .then(answer => { res.json({ answerId: answer._id }); })
        .catch(err => { res.json({ error: err })});
}

module.exports = {
    addAnswer: addAnswer
}