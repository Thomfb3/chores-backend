"use strict"
const express = require("express");
const router = new express.Router();
const RewardController = require('./../controllers/rewardController');
const { uploadImages } = require('./../helpers/handlerFileUpload');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for rewards. */
router
    .route("/")
    .get(
        ensureLoggedInAndCorrectTeam,
        RewardController.getAllRewardsForTeam
    )
    .post(
        ensureAdminAndCorrectTeam,
        RewardController.createReward
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        RewardController.getReward
    )
    .patch(
        ensureAdminAndCorrectTeam,
        uploadImages,
        RewardController.resizeRewardImages,
        RewardController.updateReward
    )
    .delete(
        ensureAdminAndCorrectTeam,
        RewardController.deleteReward
    );

router
    .route('/status/:id')
    .patch(
        ensureLoggedInAndCorrectTeam,
        RewardController.updateRewardStatusActivity,
    );

module.exports = router;