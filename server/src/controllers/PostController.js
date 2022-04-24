var postModel = require('../models/post');

async function addPost(req, res) {  
    let title = req.body.title;
    let content = req.body.content;
    
    var post = new postModel({
        title: title,
        content: content,
    });

    await post.save()
    .then(post => { res.sendStatus(200); })
    .catch(err => { res.json({ error: err })});
}

module.exports = {
    add: addPost
}