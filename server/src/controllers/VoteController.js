const voteModel = require('../models/vote');
const mongoose = require('mongoose')

async function getGenericVote(searchReq) {
    const result = await voteModel.aggregate([
        {
            $match: searchReq
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: "$vote"
                }
            }
        }
    ])

    return result[0] ? (result[0].count ?? 0) : 0
}

async function getCommentVote(commentId) {
    return await getGenericVote({ comment: new mongoose.Types.ObjectId(commentId) })
}

async function getAnswerVote(answerId) {
    return await getGenericVote({ answer: new mongoose.Types.ObjectId(answerId) })
}

async function getPostVote(postId) {
    return await getGenericVote({ post: new mongoose.Types.ObjectId(postId) })
}

async function modifyVote(req, res, modelName, newVoteCount) {
    let searchReq = { user: req.user._id }
    searchReq[modelName] = req.params.id

    let voteSet = { vote: newVoteCount }

    existingVote = await voteModel.findOne(searchReq)
    if (existingVote) {
        await voteModel.updateOne(searchReq, voteSet)
            .then(vote => res.sendStatus(200))
            .catch(err => res.sendStatus(500).json({ error: err }))
    } else {
        var modelCreateInfo = searchReq;
        modelCreateInfo.vote = newVoteCount;

        // We can create a new vote
        let vote = new voteModel(modelCreateInfo)

        await vote.save()
            .then(_ => { res.sendStatus(200) })
            .catch(err => { res.json({ error: err })});
    }
}

async function getCurrentUserVoteDetail(req, id, modelName) {
    if (!req.user) {
        return 0;
    }

    let searchReq = { user: req.user._id }
    searchReq[modelName] = id

    var result = await voteModel.findOne(searchReq);
    return result?.vote ?? 0;
}

async function getCurrentUserVote(req, res, modelName) {
    let vote = await getCurrentUserVoteDetail(req, req.params.id, modelName)
    res.json({ vote: vote })
}

async function getTotalVote(req, res, modelName) {
    let requirements = {}
    requirements[modelName] = new mongoose.Types.ObjectId(req.params.id)

    let voteCount = await getGenericVote(requirements).catch(err => res.sendStatus(500).json({ error: err }))
    res.json({ vote: voteCount })
}

async function upvoteComment(req, res) {
    await modifyVote(req, res, 'comment', 1)
}

async function downvoteComment(req, res) {
    await modifyVote(req, res, 'comment', -1)
}

async function zerovoteComment(req, res) {
    await modifyVote(req, res, 'comment', 0)
}

async function upvoteAnswer(req, res) {
    await modifyVote(req, res, 'answer', 1)
}

async function downvoteAnswer(req, res) {
    await modifyVote(req, res, 'answer', -1)
}

async function zerovoteAnswer(req, res) {
    await modifyVote(req, res, 'answer', 0)
}

async function upvotePost(req, res) {
    await modifyVote(req, res, 'post', 1)
}

async function downvotePost(req, res) {
    await modifyVote(req, res, 'post', -1)
}

async function zerovotePost(req, res) {
    await modifyVote(req, res, 'post', 0)
}

async function getCurrentUserCommentVoteDetail(req, id) {
    return await getCurrentUserVoteDetail(req, id, 'comment')
}

async function getCurrentUserPostVoteDetail(req, id) {
    return await getCurrentUserVoteDetail(req, id, 'post')
}

async function getCurrentUserAnswerVoteDetail(req, id) {
    return await getCurrentUserVoteDetail(req, id, 'answer')
}

async function getCurrentUserAnswerVote(req, res) {
    await getCurrentUserVote(req, res, 'answer')
}

async function getCurrentUserPostVote(req, res) {
    await getCurrentUserVote(req, res, 'post')
}

async function getCurrentUserCommentVote(req, res) {
    await getCurrentUserVote(req, res, 'comment')
}

async function getCurrentUserAnswerVote(req, res) {
    await getCurrentUserVote(req, res, 'answer')
}

async function getCurrentUserPostVote(req, res) {
    await getCurrentUserVote(req, res, 'post')
}

async function getCommentTotalVote(req, res) {
    await getTotalVote(req, res, 'comment')
}

async function getAnswerTotalVote(req, res) {
    await getTotalVote(req, res, 'answer')
}

async function getPostTotalVote(req, res) {
    await getTotalVote(req, res, 'post')
}

module.exports = {
    getPostVote: getPostVote,
    getAnswerVote: getAnswerVote,
    getCommentVote: getCommentVote,

    getCurrentUserPostVote: getCurrentUserPostVote,
    getCurrentUserAnswerVote: getCurrentUserAnswerVote,
    getCurrentUserCommentVote: getCurrentUserCommentVote,
    getCurrentUserCommentVoteDetail: getCurrentUserCommentVoteDetail,
    getCurrentUserPostVoteDetail: getCurrentUserPostVoteDetail,
    getCurrentUserAnswerVoteDetail: getCurrentUserAnswerVoteDetail,

    getPostTotalVote: getPostTotalVote,
    getAnswerTotalVote: getAnswerTotalVote,
    getCommentTotalVote: getCommentTotalVote,

    upvotePost: upvotePost,
    downvotePost: downvotePost,
    zerovotePost: zerovotePost,
    upvoteAnswer: upvoteAnswer,
    downvoteAnswer: downvoteAnswer,
    zerovoteAnswer: zerovoteAnswer,
    upvoteComment: upvoteComment,
    downvoteComment: downvoteComment,
    zerovoteComment: zerovoteComment,
}