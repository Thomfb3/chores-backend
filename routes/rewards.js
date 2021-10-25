"use strict"
const express = require("express");
const router = new express.Router();
const rewardController = require('./../controllers/rewardController');
const { uploadImages } = require('./../helpers/handlerFileUpload');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for rewards. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        rewardController.getAllRewardsForTeam
    )
    .post(
        ensureAdminAndCorrectTeam,
        rewardController.createReward
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        rewardController.getReward
    )
    .patch(
        ensureAdminAndCorrectTeam,
        uploadImages,
        rewardController.resizeRewardImages,
        rewardController.updateRewardStatusActivity,
        rewardController.updateReward
    )
    .delete(
        ensureAdminAndCorrectTeam,
        rewardController.deleteReward
    );

module.exports = router;