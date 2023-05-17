var commentModel = require('../models/comment');
var commonPopulators = require('./CommonPopulators');
const VoteController = require('./VoteController');

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
        .then(async comment => {
            await commentModel.populate(comment, commonPopulators.commentPopulators)
                .then(comment => res.json(comment))
                .catch(err => res.status(500).json({ error: err }));
        })
        .catch(err => { res.json({ error: err })});
}

async function listCommentDetail(idComposite, req, res, resultProvider) {
    let postId = idComposite.postId
    let answerId = idComposite.answerId

    if (!postId && !answerId) {
        res.status(403).json({
            message: "Answer ID and post ID are all empty!"
        });

        return false;
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
                comment.voted = await VoteController.getCurrentUserCommentVoteDetail(req, comment._id);
                return comment
            }))

            resultProvider(comments)
        })
        .catch(err => 
            res.status(500).json({ error: err }))
}

async function listComment(req, res) {
    listCommentDetail(req.query, req, res, comments => { res.json(comments) })
}

module.exports = {
    addComment: addComment,
    listComment: listComment,
    listCommentDetail: listCommentDetail
}