var userModel = require('../models/user')
var roleConsts = require('../consts/role');
var sharp = require('sharp')

const fs = require('fs')
const errorCodes = require('../consts/errors')
const requestUtils = require('../utils/RequestUtils')

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

    userModel.register({ username: req.body.username, email: email, name: name, role: "user" }, req.body.password)
        .then(user => { res.sendStatus(200); })
        .catch(err => { res.json({ error: err })});
}

async function handleUserInfo(req, res) {
    let id = req.params.id;
    let userObj = await userModel.findOne({ _id: id });

    if ((userObj == null) || (userObj == undefined)) {
        res.sendStatus(404);
    } else {
        let userName = (userObj.name == null) ? userObj.username : userObj.name;
        res.json({ 
            userName: userName,
            email: userObj.email,
            role: userObj.role.NAME,
            reputation: userObj.reputation,
            about: userObj.about,
            avatar: userObj.avatar,
            joinTime: userObj._id.getTimestamp(),
        })
    }
}

async function handleCurrentUserInfo(req, res) {
    res.json({ id: req.user._id, username: req.user.username, role: req.user.role.NAME });
}

async function getAllUsers(req, res) {
    let users = await userModel.find();

    if (!users) {
        res.status(404);
    } else {
        res.json(users);
    }
}

async function handleSetUserRole(req, res) {
    let role = req.body.role;
    console.log(role)

    if (roleConsts.getRoleByName(role) == null) {
        res.status(400).send({ message: 'There\'s no known role with the given name' });
    } else {
        let userId = req.body._id;
        let userName = req.body.username;

        if ((userId != undefined) && (userId != null)) {
            userModel.updateOne({ _id: userId }, { $set: { role: role }})
                .then(user => { res.sendStatus(200); })
                .catch(err => { res.json({ error: err })});
        } else if ((userName != undefined) && (userName != null)) {
            userModel.updateOne({ username: userName }, { $set: { role: role }})
                .then(user => { res.sendStatus(200); })
                .catch(err => { res.json({ error: err })});
        } else {
            res.status(400).send({ message: 'No user id or username provided to update role!' });
        }
    }
}

async function handleUpdateUserProfile(req, res) {
    let name = req.body.userName;
    let about = req.body.userAbout;
    let avatarFile = req.file;

    let avatarBuffer = null;

    if (avatarFile) {
        const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
        const MAX_IMAGE_WIDTH = 1024;
        const MAX_IMAGE_HEIGHT = 1024;
    
        if (req.file.size > MAX_AVATAR_SIZE) {
            fs.unlinkSync(req.file.path)

            res.status(403).json({
                error: errorCodes.FileTooBig,
                message: "The uploaded avatar file is too big!"
            })
    
            return;
        }
    
        // Check image size
        try {
            let image = sharp(req.file.path);
            let metadata = await image.metadata();
    
            if ((metadata.width > MAX_IMAGE_WIDTH) || (metadata.height > MAX_IMAGE_HEIGHT)) {
                res.status(403).json({
                    error: errorCodes.FileDimensionTooBig,
                    maximumDimension: [ MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT ],
                    message: "The avatar image dimension is too large!"
                })

                fs.unlinkSync(req.file.path);
                return;
            }
        } catch (err) {
            res.status(403).json({
                error: errorCodes.FileCorrupted,
                message: err
            })

            fs.unlinkSync(req.file.path);
            return;
        }

        avatarBuffer = await requestUtils.requestFileToBase64(avatarFile)
    }

    userModel.updateOne({ _id: req.user._id }, {
        $set: {
            username: name,
            about: about,
            avatar: avatarBuffer
        }
    })
        .then(user => res.sendStatus(200))
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
    info: handleUserInfo,
    getAll: getAllUsers,
    currentInfo: handleCurrentUserInfo,
    emailExisted: handleUserCheckEmailExists,
    updateRole: handleSetUserRole,
    updateInfo: handleUpdateUserProfile,
}