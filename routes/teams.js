"use strict"
const express = require("express");
const router = new express.Router();
const TeamController = require('./../controllers/teamController');
const { ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for Teams. */
router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        TeamController.getTeam
    )
    .patch(
        ensureAdminAndCorrectTeam,
        TeamController.updateTeam
    );

module.exports = router;