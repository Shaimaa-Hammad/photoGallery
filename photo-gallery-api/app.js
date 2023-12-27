/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

/**
 * Express routers.
 */
const authRouter = require('./routes/auth');
const photosRouter = require('./routes/photos');

/**
 * Express app initialization.
 */
var app = express();

/**
 * Express middlewares.
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/photos', photosRouter);

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.DB_URL)

/**
 * Export.
 */
module.exports = app;
