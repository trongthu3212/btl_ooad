var routers = require('express').Router();
var passport = require('passport');

var testController = require('../controllers/TestController')
var userController = require('../controllers/UserController')

routers.get('/test', testController.execute)
routers.post('/auth', passport.authenticate('local'), userController.auth)

module.exports = routers;