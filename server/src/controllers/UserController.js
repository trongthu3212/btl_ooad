var userModel = require('../models/user')

function handleUserAuth(req, res) {
    return res.sendStatus(200);
}

async function handleUserCheckEmailExists(req, res) {
    let email = req.body.email;
    let emailExisted = await userModel.exists({ email: email });
    if ((emailExisted != null) && (emailExisted != undefined)) {
        return res.status(409).send({
            message: 'The email already existed in the database!'
        });
    }

    return res.sendStatus(200);
}

async function handleUserRegister(req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;

    if ((email == null) || (username == null) || (password == null)) {
        return res.status(400).send({ message: 'One of the arguments is not provided!' });
    }

    let emailExisted = await userModel.exists({ email: email });
    if ((emailExisted != null) && (emailExisted != undefined)) {
        return res.status(409).send({
            message: 'The email already existed in the database!'
        });
    }

    userModel.register({ username: req.body.username, email: email, name: name }, req.body.password)
        .then(user => { res.sendStatus(200); })
        .catch(err => { res.json({ error: err })});
}

async function handleUserInfo(req, res) {
    let username = req.params.username;
    let userObj = await userModel.findOne({ username: username });

    if ((userObj == null) || (userObj == undefined)) {
        res.sendStatus(404);
    } else {
        let readableName = (userObj.name == null) ? userObj.username : userObj.name;
        res.json({ username: username, readableName: readableName, email: userObj.email, joinTime: userObj._id.getTimestamp() })
    }
}

async function handleCurrentUserInfo(req, res) {
    res.json({ id: req.user._id, username: req.user.username });
}

function handleUserDeauth(req, res) {
    req.logout();
    res.clearCookie('connect.sid', {path: '/'});
    res.sendStatus(200);
}

module.exports = {
    auth: handleUserAuth,
    deauth: handleUserDeauth,
    register: handleUserRegister,
    info: handleUserInfo,
    currentInfo: handleCurrentUserInfo,
    emailExisted: handleUserCheckEmailExists,
}