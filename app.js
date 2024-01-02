const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const dotenv = require("dotenv");

const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/subcategory');
const bannerRouter = require('./routes/banner');
const occasionRouter = require('./routes/occasion');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// configure .env file
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/banner', bannerRouter);
app.use('/occasion', occasionRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

console.log("Server started Successfully...");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// MONGO DB
const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOLINK, {
      dbName: process.env.DBNAME, 
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas", error);
  }
};

connectToMongoDB();

module.exports = app;
