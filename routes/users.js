"use strict"
const express = require("express");
const router = new express.Router();
const UserController = require('./../controllers/userController');
const { uploadImages } = require('../helpers/handlerFileUpload');
const { ensureLoggedIn, ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for users. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        UserController.getAllUsersForTeam
    );

router
    .route('/:id')
    .get(
        ensureLoggedIn,
        UserController.getUser
    )
    .patch(
        ensureAdminAndCorrectTeam,
        uploadImages,
        UserController.resizeUserImages,
        UserController.updateUser
    )
    .delete(
        ensureAdminAndCorrectTeam,
        UserController.deleteUser
    );

module.exports = router;