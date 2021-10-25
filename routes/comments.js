"use strict"
const express = require("express");
const router = new express.Router();
const commentController = require('../controllers/commentController');
const { ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for Chore Comments. */
router
    .route("/chore/:choreId")
    .get(
        ensureLoggedInAndCorrectTeam,
        commentController.getAllCommentsForChore
    )
    .post(
        ensureLoggedInAndCorrectTeam,
        commentController.postComment
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        commentController.getComment
    )
    .patch(
        ensureLoggedInAndCorrectTeam,
        commentController.updateComment
    )
    .delete(
        ensureLoggedInAndCorrectTeam,
        commentController.deleteComment
    );

module.exports = router;