const path = require('path');
const express = require('express');
const mongoose = require('mongoose')

// Application's requirements
const appConfig = require('./config/app');
const dbConfig = require('./config/db');
const apiRouters = require('./routes/api');
const userModel = require('./models/user');

const app = express();

function sampleDbInsert() {
  var testUser = new userModel({
    username: 'testUser',
    email: 'testUser@gmail.com',
    password: 'testUserPassword'
  });

  testUser.save()
    .then(user => {
      console.log('New user %d', user._id);
    })
    .catch(err => {
      console.log(err);
    });
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

function bindAndStartServer() {
  app.use('/api/', apiRouters)
  app.listen(appConfig.port, () => console.log('Listening on port %d', appConfig.port))  
}

connectToDb();
bindAndStartServer();