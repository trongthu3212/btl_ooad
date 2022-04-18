const path = require('path');
const express = require('express');

// Application's requirements
const appConfig = require('./config/app');
const apiRouters = require('./routes/api');

const app = express();

app.use('/api/', apiRouters)
app.listen(appConfig.port, () => console.log('Listening on port %d', appConfig.port))
