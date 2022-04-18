var routers = require('express').Router();
var testController = require('../controllers/TestController')

routers.get('/test', testController.execute)

module.exports = routers;