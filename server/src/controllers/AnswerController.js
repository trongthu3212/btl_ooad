var answerModel = require('../models/answer');
const postModel = require('../models/post');

async function addAnswer(req, res) {
    let postId = req.body.postId
    let content = req.body.content

    var answer = new answerModel({
        post: postId,
        content: content,
        author: req.user._id
    });

    await answer.save()
        .then(answer => { res.json(answer); })
        .catch(err => { res.json({ error: err })});
}

async function acceptAnswer(req, res) {
    let answerId = req.params.id
    let answer = await answerModel.findById(answerId)
        .catch(err => { res.status(500).json({ error: err })})

    if (answer == null) {
        res.status(404).json({ error: "Answer ID not found!" })
    }

    let post = await postModel.findById(answer.post)
    if (post == null) {
        res.status(404).json({ error: "Can't find the post related to this answer!" })
        return
    }

    console.log(post.author)
    console.log(req.user._id)

    if (!post.author.equals(req.user._id)) {
        res.status(401).json({ error: "The logged in user is not the author of the question!" })
        return
    }

    await answerModel.find({ post: answer.post, accepted: true }).then(
        async answers => {
            if (answers.length > 0) {
                if ((answers.length == 1) && (answers[0]._id == answerId)) {
                    res.sendStatus(200);
                }
                else {
                    res.status(400).json({ error: "This post already has an accepted answer!" })
                }

                return
            }

            await answerModel.updateOne({ _id: answerId }, { accepted: true }).then(
                answer => res.sendStatus(200)
            ).catch(err => res.status(500).json({ error: err }))
        }
    ).catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    addAnswer: addAnswer,
    acceptAnswer: acceptAnswer
}