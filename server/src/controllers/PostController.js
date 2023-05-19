var postModel = require('../models/post');
var postConfig = require('../config/post');
var answerModel = require('../models/answer');
var commonPopulators = require('./CommonPopulators');
const VoteController = require('./VoteController');
const CommentController = require('./CommentController')

const postNoFilterAggregate = [
    {
        $lookup: {
            from: "answers",
            localField: "_id",
            foreignField: "post",
            as: "answers"
        }
    },
    {
        $lookup: {
            from: "users",
            let: { authorId: "$author" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$authorId"]
                        }
                    }
                },
                {
                    $project: {
                        id: "$_id",
                        _id: 0,
                        reputation: 1,
                        username: 1,
                    }
                },
            ],
            as: "authors"
        }
    },
    {
        $lookup: {
            from: "courses",
            let: { courseId: "$course" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$courseId"]
                        }
                    }
                },
                {
                    $project: {
                        id: "$_id",
                        _id: 0,
                        name: 1,
                        code: 1
                    }
                },
            ],
            as: "courses"
        }
    },
    {
        $project: {
            id: "$_id",
            title: 1,
            shortDescription: 1,
            courseName: "$courseName",
            courseCode: "$courseCode",
            course: 1,
            authorName: "$authorName",
            author: { $arrayElemAt: ["$authors", 0] },
            course: { $arrayElemAt: ["$courses", 0] },
            answerCount: { $size: "$answers" }
        }
    }
]

const postUnansweredAggregate = [
    postNoFilterAggregate[0],
    {
        $match: {
            $expr: {
                $eq: [{ $size: "$answers" }, 0]
            }
        }
    },
    ...postNoFilterAggregate.slice(1)
]

async function addPost(req, res) {  
    let title = req.body.title;
    let content = req.body.content;
    let courseId = req.body.courseId;

    if (!courseId) {
        res.status(403).json({
            message: "No course ID is provided!"
        })
    }

    let previousLen = content.length;
    let shortDescription = content.substr(0, postConfig.maxShortDescriptionLength)

    shortDescription = shortDescription.replace(/[\r\n]+/g, ' ')

    if (previousLen != shortDescription.length) {
        shortDescription += "..."
    }
    
    var post = new postModel({
        title: title,
        content: content,
        shortDescription: shortDescription,
        author: req.user._id,
        course: courseId
    });

    await post.save()
        .then(post => { res.json({ postId: post._id }); })
        .catch(err => { res.json({ error: err })});
}

async function listPosts(req, res) {
    let page = req.body.page;
    let postPerPage = req.body.quantity;
    let filter = req.body.filter;
    let keyword = req.body.keyword;

    if ((page <= 0) || (postPerPage <= 0)) {
        res.status(400).send({ message: 'Page must be larger then 0!' });
    } else {
        // Pagination system based on offset 0
        page -= 1;

        let options = {
            offset: page * postPerPage,
            limit: postPerPage,
            sort: { _id: 'desc' }
        }

        var filters = filter ? filter.split(',') : [];
        const unansweredFilter = filters.includes("unanswered");

        var aggregate = unansweredFilter ? [...postUnansweredAggregate] : [...postNoFilterAggregate];
        if (keyword)
        {
            aggregate.unshift(
                {
                    $match: {
                        $or: [
                            { $text: { $search: keyword, $caseSensitive: false, $diacriticSensitive: false } }
                        ]
                    },
                }
            )
        }
    
        let aggreator = postModel.aggregate(aggregate)

        await postModel.aggregatePaginate(aggreator, options)
            .then(async post => {
                post.docs = await Promise.all(post.docs.map(async post => {
                    post.score = await VoteController.getPostVote(post._id);
                    if (req.user) {
                        post.voted = await VoteController.getCurrentUserPostVoteDetail(req, post._id);
                    }
                    return post;
                }))
                res.json({ posts: post.docs, globalPostCount: (filters.length != 0) || keyword ? post.totalDocs : await postModel.estimatedDocumentCount() })
            } )
            .catch(err =>
                res.status(500).json(err));
    }
}

async function getPost(req, res) {
    let {idquestion} = req.params;
    let post = await postModel.findById(idquestion)
        .populate(commonPopulators.postPopulators)
        .lean({ virtuals: true });

    if ((post == null) || (post == undefined)) {
        res.status(404);
    } else {
        post.score = await VoteController.getPostVote(idquestion)
        if (req.user) {
            post.voted = await VoteController.getCurrentUserPostVoteDetail(req, idquestion);
        }

        await CommentController.listCommentDetail({ postId: post._id }, req, res, comments => { post.comments = comments })

        await answerModel.find({ post: idquestion })
            .populate(commonPopulators.answerPopulators)
            .lean({ virtuals: true })
            .then(async answers => {
                post.answers = await Promise.all(answers.map(async answer => {
                    answer.score = await VoteController.getAnswerVote(answer._id);
                    if (req.user) {
                        answer.voted = await VoteController.getCurrentUserAnswerVoteDetail(req, answer._id);
                    }
                    await CommentController.listCommentDetail({ answerId: answer._id }, req, res, comments => { answer.comments = comments })
                    
                    return answer;
                }));

                res.json(post);
            })
            .catch(err => 
                res.json({ error: err }));
    }
}

async function getAllPosts(req, res) {
    let posts = await postModel.find().lean({ virtuals: true });
    posts = await Promise.all(posts.map(async post => post.score = await VoteController.getPostVote(post._id)))

    if (!posts) {
        res.status(404);
    } else {
        res.json(posts);
    }
}

async function updatePost(req, res) {
    let obj = await postModel.findById(req.query._id);
    if ((obj == undefined) || (obj == null)) {
        res.sendStatus(404);
    } else {
        if ((req.user.role.EDIT_ANY == true) || (req.user._id.equals(obj.author))) {
            delete req.body.view;

            postModel.updateOne({ _id: req.query._id}, req.body)
                .then(post => { res.sendStatus(200) })
                .catch(err => { res.json({ error: err })});
        } else {
            res.sendStatus(401);
        }
    }
}   

async function deletePost(req, res) {
    let obj = await postModel.findById(req.body._id);
    if ((obj == undefined) || (obj == null)) {
        res.sendStatus(404);
    } else {
        if ((req.user.role.DELETE_ANY == true) || (req.user._id.equals(obj.author))) {
            await postModel.deleteOne({ "_id": req.body._id})
            .then(post => { res.sendStatus(200) })
            .catch(err => { res.json({ error: err })});
        } else {
            res.sendStatus(401);
        }
    }
}

async function increasePostView(req, res) {
    let obj = await postModel.findById(req.body.id);

    if ((obj == undefined) || (obj == null)) {
        res.sendStatus(404);
    } else {
        let viewObj = {}
        viewObj.view = (obj.view ?? 0) + 1;

        postModel.updateOne({ _id: req.body.id }, viewObj)
            .then(post => { res.sendStatus(200) })
            .catch(err => { res.json({ error: err })});
    }
}

module.exports = {
    add: addPost,
    list: listPosts,
    get: getPost,
    getAll: getAllPosts,
    update: updatePost,
    delete: deletePost,
    increaseView: increasePostView
}