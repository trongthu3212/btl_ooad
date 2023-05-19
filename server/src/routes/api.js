var routers = require('express').Router();
var passport = require('passport');
var multer = require('multer')
const upload = multer({ dest: 'uploads/' });

var testController = require('../controllers/TestController')
var userController = require('../controllers/UserController')
const authEnsurance = require('../middleware/AuthEnsurance')
var postController = require('../controllers/PostController')
var courseController = require('../controllers/CourseController')
var commentController = require('../controllers/CommentController')
var answerController = require('../controllers/AnswerController');
const VoteController = require('../controllers/VoteController');
const CourseController = require('../controllers/CourseController');
const AuthEnsurance = require('../middleware/AuthEnsurance');
const PostController = require('../controllers/PostController');

routers.get('/test', testController.execute)
routers.get('/emailExisted', userController.emailExisted)
routers.post('/listPosts', postController.list)
routers.get('/getAllPosts', postController.getAll)
routers.get('/getAllUsers', userController.getAll)
routers.get('/getPost/:idquestion', postController.get)
routers.get('/user/:id', userController.info)
routers.get('/currentUser', authEnsurance.ensureLoggedIn, userController.currentInfo)
routers.post('/login', [ authEnsurance.ensureLoggedOut, passport.authenticate('local') ], userController.auth)
routers.post('/logout', authEnsurance.ensureLoggedIn, userController.deauth)
routers.post('/register', authEnsurance.ensureLoggedOut, userController.register)
routers.post('/updateRole', authEnsurance.ensureLoggedIn, userController.updateRole)
routers.post('/user/update', upload.single('userAvatar'), authEnsurance.ensureLoggedIn, userController.updateInfo)
routers.post('/addPost', authEnsurance.ensureLoggedIn, postController.add)
routers.put('/updatePost', authEnsurance.ensureLoggedIn, postController.update)
routers.put('/post/increaseView', postController.increaseView)
routers.delete('/deletePost', authEnsurance.ensureLoggedIn, postController.delete)

routers.post('/course/create', authEnsurance.ensureLoggedIn, courseController.addCourse)
routers.post('/answer/add', authEnsurance.ensureLoggedIn, answerController.addAnswer)
routers.post('/answer/accept/:id', authEnsurance.ensureLoggedIn, answerController.acceptAnswer)
routers.post('/answer/unaccept/:id', authEnsurance.ensureLoggedIn, answerController.unacceptAnswer)
routers.post('/comment/add', authEnsurance.ensureLoggedIn, commentController.addComment)
routers.get('/comment/list', commentController.listComment)

routers.get('/post/totalVote/:id', VoteController.getPostTotalVote)
routers.get('/answer/totalVote/:id', VoteController.getAnswerTotalVote)
routers.get('/comment/totalVote/:id', VoteController.getCommentTotalVote)

routers.get('/post/getCurrentUserVote/:id', authEnsurance.ensureLoggedIn, VoteController.getCurrentUserPostVote)
routers.get('/answer/getCurrentUserVote/:id', authEnsurance.ensureLoggedIn, VoteController.getCurrentUserAnswerVote)
routers.get('/comment/getCurrentUserVote/:id', authEnsurance.ensureLoggedIn, VoteController.getCurrentUserCommentVote)

routers.post('/post/upvote/:id', authEnsurance.ensureLoggedIn, VoteController.upvotePost)
routers.post('/post/downvote/:id', authEnsurance.ensureLoggedIn, VoteController.downvotePost)
routers.post('/post/zerovote/:id', authEnsurance.ensureLoggedIn, VoteController.zerovotePost)
routers.post('/answer/upvote/:id', authEnsurance.ensureLoggedIn, VoteController.upvoteAnswer)
routers.post('/answer/downvote/:id', authEnsurance.ensureLoggedIn, VoteController.downvoteAnswer)
routers.post('/answer/zerovote/:id', authEnsurance.ensureLoggedIn, VoteController.zerovoteAnswer)
routers.post('/comment/upvote/:id', authEnsurance.ensureLoggedIn, VoteController.upvoteComment)
routers.post('/comment/downvote/:id', authEnsurance.ensureLoggedIn, VoteController.downvoteComment)
routers.post('/comment/zerovote/:id', authEnsurance.ensureLoggedIn, VoteController.zerovoteComment)

routers.get('/course/list', CourseController.getAllCourses)
routers.post('/course/add', AuthEnsurance.ensureLoggedIn, CourseController.addCourse)
routers.post('/course/enroll', AuthEnsurance.ensureLoggedIn, CourseController.enrollCourse)
routers.post('/course/leave', AuthEnsurance.ensureLoggedIn, CourseController.leaveCourse)
routers.post('/course/suggest', CourseController.suggestCourses)

routers.get('/user/getCourses/:id', CourseController.getParticipateCourses)

module.exports = routers;