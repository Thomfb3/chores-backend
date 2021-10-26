"use strict";
const express = require("express");
const router = new express.Router();
const AuthController = require("../controllers/authController");
const { ensureLoggedIn } = require("../middleware/auth.js");

/** Routes for authentication. */
/** POST /auth/token:  { username, password, teamName, teamPassword } => { token } **/
router
    .route("/token")
    .post(AuthController.authenticateAndGetToken)

/** POST /auth/register:   { user } => { token }
 * user must include { username, password, firstName, email } **/
router
    .route("/register")
    .post(AuthController.registerAndGetToken)

/** POST /auth/create-team:   { username, teamName, teamPassword } => { token }
 * user must include { username, teamName, teamPassword } **/
router
    .route("/create-team")
    .post(
        ensureLoggedIn,
        AuthController.createTeamAndGetToken
    );

/** PATCH /auth/join-team:   { username, teamName, teamPassword } => { token }
 * user must include { username, teamName, teamPassword } **/
router
    .route("/join-team")
    .post(
        ensureLoggedIn,
        AuthController.joinTeamAndGetToken
    );

module.exports = router;
