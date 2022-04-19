const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')

// Application's requirements
const appConfig = require('./config/app');
const dbConfig = require('./config/db');
const sessionConfig = require('./config/session')
const apiRouters = require('./routes/api');
const userModel = require('./models/user');
const postModel = require('./models/post');

const app = express();

function sampleDbInsert() {
  userModel.register({ username: 'thu', email: 'thuNgu@gmail.com' }, 'thu');
}

function connectToDb() {
  mongoose.connect(
    `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.clusterName}.oqca2.mongodb.net/${dbConfig.databaseName}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  );
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error: '));
  db.once('open', function() { console.log('Database successfully connected!') });
}

function setupSession() {
  app.use(session({
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: sessionConfig.loginExpireInSeconds * 1000 }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(userModel.createStrategy());
  passport.serializeUser(userModel.serializeUser());
  passport.deserializeUser(userModel.deserializeUser());
}

function bindAndStartServer() {
  // Work as body parser
  app.use(express.urlencoded({ extended: false }));
  app.use('/api/', apiRouters)
  app.listen(appConfig.port, () => console.log('Listening on port %d', appConfig.port))  
}

connectToDb();
setupSession();
bindAndStartServer();