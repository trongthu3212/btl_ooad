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
    let password= req.body.password;

    if ((email == null) || (username == null) || (password == null)) {
        return res.status(400).send({ message: 'One of the arguments is not provided!' });
    }

    let emailExisted = await userModel.exists({ email: email });
    if ((emailExisted != null) && (emailExisted != undefined)) {
        return res.status(409).send({
            message: 'The email already existed in the database!'
        });
    }

    userModel.register({ username: req.body.username, email: email }, req.body.password)
        .then(user => { res.sendStatus(200); })
        .catch(err => { res.json({ error: err })});
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
    emailExisted: handleUserCheckEmailExists,
}