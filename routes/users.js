"use strict"
const express = require("express");
const router = new express.Router();
const userController = require('./../controllers/userController');
const { uploadImages } = require('../helpers/handlerFileUpload');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for users. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        userController.getAllUsersForTeam
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        userController.getUser
    )
    .patch(
        ensureAdminAndCorrectTeam,
        uploadImages,
        userController.resizeUserImages,
        userController.updateUser
    )
    .delete(
        ensureAdminAndCorrectTeam,
        userController.deleteUser
    );

module.exports = router;