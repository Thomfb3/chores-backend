"use strict";
/** Express app for ChoresApp. */
const path = require('path');
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const rewardsRoutes = require("./routes/rewards");
const choresRoutes = require("./routes/chores");
const usersRoutes = require("./routes/users");
const teamsRoutes = require("./routes/teams");
const commentRoutes = require("./routes/comments");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/teams", teamsRoutes);
app.use("/api/v1/chores", choresRoutes);
app.use("/api/v1/rewards", rewardsRoutes);
app.use("/api/v1/comments", commentRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
