var commentModel = require('../models/comment');
var commonPopulators = require('./CommonPopulators');
const VoteController = require('./VoteController');
var voteController = require('./VoteController')

async function addComment(req, res) {
    let postId = req.body.postId
    let answerId = req.body.answerId

    if (!postId && !answerId) {
        res.error(403).json({
            message: "Answer ID and post ID are all empty!"
        });

        return;
    }

    let content = req.body.content

    let commentObj = {
        content: content,
        author: req.user._id
    }

    if (postId) {
        commentObj.post = postId;
    } else {
        commentObj.answer = answerId;
    }

    var comment = new commentModel(commentObj);

    await comment.save()
        .then(comment => { res.json({ commentId: comment._id }); })
        .catch(err => { res.json({ error: err })});
}

async function listComment(req, res) {
    let postId = req.query.postId
    let answerId = req.query.answerId

    if (!postId && !answerId) {
        res.status(403).json({
            message: "Answer ID and post ID are all empty!"
        });

        return;
    }

    let findVar = {}

    if (postId) {
        findVar.post = postId;
    } else {
        findVar.answer = answerId;
    }

    await commentModel.find(findVar)
        .populate(commonPopulators.commentPopulators)
        .lean({ virtuals: true })
        .then(async comments => {
            comments = await Promise.all(comments.map(async comment => {
                comment.score = await VoteController.getCommentVote(comment._id)
                return comment
            }))

            res.json(comments)
        })
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    addComment: addComment,
    listComment: listComment
}