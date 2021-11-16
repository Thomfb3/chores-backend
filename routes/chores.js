"use strict"
const express = require("express");
const router = new express.Router();
const ChoreController = require('./../controllers/choreController');
const { uploadImages } = require('../helpers/handlerFileUpload');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for chores. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        ChoreController.getAllChoresForTeam
    )
    .post(
        ensureAdminAndCorrectTeam,
        ChoreController.createChore
    );

router
    .route("/unclaimed")
    .get(
        ensureLoggedInAndCorrectTeam,
        ChoreController.getUnclaimedChoresForTeam
    )
    .post(
        ensureAdminAndCorrectTeam,
        ChoreController.createChore
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        ChoreController.getChore
    )
    .patch(
        ensureLoggedInAndCorrectTeam,
        uploadImages,
        ChoreController.resizeChoreImages,
        ChoreController.updateChore 
    )
    .delete(
        ensureAdminAndCorrectTeam,
        ChoreController.deleteChore
    );

router
    .route('/status/:id')
    .patch(
        ensureLoggedInAndCorrectTeam,
        ChoreController.updateChoreStatusActivity,
    );

router
    .route("/user/:id")
    .get(
        ensureLoggedInAndCorrectTeam,
        ChoreController.getAllChoresForUser
    );






module.exports = router;
