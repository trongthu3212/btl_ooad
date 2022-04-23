var routers = require('express').Router();
var passport = require('passport');

var testController = require('../controllers/TestController')
var userController = require('../controllers/UserController')
const authEnsurance = require('../middleware/AuthEnsurance')

routers.get('/test', testController.execute)
routers.get('/emailExisted', userController.emailExisted)
routers.post('/login', [ authEnsurance.ensureLoggedOut, passport.authenticate('local') ], userController.auth)
routers.post('/logout', authEnsurance.ensureLoggedIn, userController.deauth)
routers.post('/register', authEnsurance.ensureLoggedOut, userController.register)

module.exports = routers;