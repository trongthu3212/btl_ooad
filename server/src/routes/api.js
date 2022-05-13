var routers = require('express').Router();
var passport = require('passport');

var testController = require('../controllers/TestController')
var userController = require('../controllers/UserController')
const authEnsurance = require('../middleware/AuthEnsurance')
var postController = require('../controllers/PostController')

routers.get('/test', testController.execute)
routers.get('/emailExisted', userController.emailExisted)
routers.get('/listPosts', postController.list)
routers.get('/getAllPosts', postController.getAll)
routers.get('/getAllUsers', userController.getAll)
routers.get('/getPost/:idquestion', postController.get)
routers.get('/user/:username', userController.info)
routers.get('/currentUser', authEnsurance.ensureLoggedIn, userController.currentInfo)
routers.post('/login', [ authEnsurance.ensureLoggedOut, passport.authenticate('local') ], userController.auth)
routers.post('/logout', authEnsurance.ensureLoggedIn, userController.deauth)
routers.post('/register', authEnsurance.ensureLoggedOut, userController.register)
routers.post('/updateRole', authEnsurance.ensureLoggedIn, userController.updateRole)
routers.post('/setUserInfo', authEnsurance.ensureLoggedIn, userController.setInfo)
routers.post('/addPost', authEnsurance.ensureLoggedIn, postController.add)
routers.put('/updatePost', authEnsurance.ensureLoggedIn, postController.update)
routers.delete('/deletePost', authEnsurance.ensureLoggedIn, postController.delete)

module.exports = routers;