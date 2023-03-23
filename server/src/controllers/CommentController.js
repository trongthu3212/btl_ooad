var commentModel = require('../models/comment');

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

module.exports = {
    addComment: addComment
}