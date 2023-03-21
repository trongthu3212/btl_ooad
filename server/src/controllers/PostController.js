var postModel = require('../models/post');
var postConfig = require('../config/post')

const postPopulators = [
    { path: 'author', select: 'username name' },
    { path: 'course', select: 'name code' }
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

    let shortDescription = content.substr(0, postConfig.maxShortDescriptionLength)
    shortDescription = shortDescription.replace(/[\r\n]+/g, ' ')

    shortDescription += "..."
    
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
    let page = req.query.page;
    let postPerPage = req.query.quantity;

    if ((page <= 0) || (postPerPage <= 0)) {
        res.status(400).send({ message: 'Page must be larger then 0!' });
    } else {
        // Pagination system based on offset 0
        page -= 1;

        let options = {
            offset: page * postPerPage,
            limit: postPerPage,
            select: 'title shortDescription author score course _id',
            populate: postPopulators,
            sort: { _id: 'desc' }       // Id compare by creation date!
        }
    
        await postModel.paginate({}, options)
            .then(post => res.json(post.docs) )
            .catch(err => res.status(500).json(err));
    }
}

async function getPost(req, res) {
    let {idquestion} = req.params;
    let post = await postModel.findById(idquestion).populate(postPopulators);

    if ((post == null) || (post == undefined)) {
        res.status(404);
    } else {
        res.json(post);
    }
}

async function getAllPosts(req, res) {
    let posts = await postModel.find();

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

module.exports = {
    add: addPost,
    list: listPosts,
    get: getPost,
    getAll: getAllPosts,
    update: updatePost,
    delete: deletePost,
}