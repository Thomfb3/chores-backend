"use strict"
const express = require("express");
const router = new express.Router();
const TeamController = require('./../controllers/teamController');
const { ensureLoggedIn, ensureAdminAndCorrectTeam, ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for Teams. */
router
    .route('/:id')
    .get(
        ensureLoggedIn,
        TeamController.getTeam
    )
    .patch(
        ensureAdminAndCorrectTeam,
        TeamController.updateTeam
    );

module.exports = router;