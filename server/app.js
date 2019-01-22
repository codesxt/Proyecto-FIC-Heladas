require('dotenv').load();
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const compression = require('compression');
const scheduled_tasks = require('./scheduled_tasks');
scheduled_tasks.run();

// Get Configuration Files
require('./api/models/db');
require('./api/config/passport');

// Get our API routes
const api = require('./api/index');

const app = express();

// Enable CORS
app.use(cors());

// Enable GZipping
app.use(compression());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/model-files', express.static(path.join(__dirname, 'model-files')));

// Enable Passport for authentication
app.use(passport.initialize());

// Set our api routes
app.use('/api/v1', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

module.exports = app;
