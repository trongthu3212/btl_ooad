var postModel = require('../models/post');
var postConfig = require('../config/post')

async function addPost(req, res) {  
    let title = req.body.title;
    let content = req.body.content;
    let shortDescription = content.substr(0, postConfig.maxShortDescriptionLength)
    shortDescription = shortDescription.replace(/[\r\n]+/g, ' ')

    shortDescription += "..."
    
    var post = new postModel({
        title: title,
        content: content,
        shortDescription: shortDescription,
        author: req.user._id
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
            select: 'title shortDescription author _id',
            populate: { path: 'author', select: 'username name' },
            sort: { _id: 'desc' }       // Id compare by creation date!
        }
    
        await postModel.paginate({}, options)
            .then(post => res.json(post.docs) )
            .catch(err => res.status(500).json(err));
    }
}

module.exports = {
    add: addPost,
    list: listPosts
}