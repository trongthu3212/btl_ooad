const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')

// Application's requirements
const appConfig = require('./config/app');
const dbConfig = require('./config/db');
const sessionConfig = require('./config/session')
const apiRouters = require('./routes/api');
const userModel = require('./models/user');
const postModel = require('./models/post');
const voteController = require('./controllers/VoteController');

const app = express();

function sampleDbInsert() {
  userModel.register({ username: 'thu', email: 'thuNgu@gmail.com' }, 'thu');
}

function connectToDb() {
  mongoose.connect(
    `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.clusterName}.f0yjhhu.mongodb.net/${dbConfig.databaseName}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  );
  
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
      delete converted._id;
    }
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error: '));
  db.once('open', function() { console.log('Database successfully connected!') });
}

function setupSession() {
  var corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With' ],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE']
  };
  app.use(cors(corsOption))
  app.use(session({
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: sessionConfig.loginExpireInSeconds * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? "none" : false
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(userModel.createStrategy());
  passport.serializeUser(userModel.serializeUser());
  passport.deserializeUser(userModel.deserializeUser());
}

function bindAndStartServer() {
  // Work as body parser
  app.use(express.urlencoded({ extended: true }));
  app.use('/', apiRouters)
  app.listen(appConfig.port, () => console.log('Listening on port %d', appConfig.port))

  voteController.getPostVote('64192ebac8a6c1ecb2f27816')
}

connectToDb();
setupSession();
bindAndStartServer();