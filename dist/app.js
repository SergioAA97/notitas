"use strict";

/*
    IMPORTS
*/
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

/**
 * ROUTES
 */
var indexRouter = require("./routes/index");
var notesRouter = require("./routes/notes");
/**
 * EXPRESS INIT
 */
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/** APP USE INIT */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * SERVE STATIC FILES IN ./public
 *  Change "public" to another folder name to serve other files
 */
app.use(express.static(path.join(__dirname, "public")));
/** ROUTING */
app.use("/", indexRouter);
app.use("/api", notesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;