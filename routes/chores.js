"use strict"
const express = require("express");
const router = new express.Router();
const choreController = require('./../controllers/choreController');
const { uploadImages } = require('../helpers/handlerFileUpload');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for chores. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        choreController.getAllChoresForTeam
    )
    .post(
        ensureAdminAndCorrectTeam,
        choreController.createChore
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        choreController.getChore
    )
    .patch(
        ensureAdminAndCorrectTeam,
        uploadImages,
        choreController.resizeChoreImages,
        choreController.updateChoreStatusActivity,
        choreController.updateChore 
    )
    .delete(
        ensureAdminAndCorrectTeam,
        choreController.deleteChore
    );

module.exports = router;