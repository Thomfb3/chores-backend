"use strict"
const express = require("express");
const router = new express.Router();
const CommentController = require('../controllers/commentController');
const { ensureLoggedInAndCorrectTeam } = require("../middleware/auth.js");

/** Routes for Chore Comments. */
router
    .route("/chore/:choreId")
    .get(
        ensureLoggedInAndCorrectTeam,
        CommentController.getAllCommentsForChore
    )
    .post(
        ensureLoggedInAndCorrectTeam,
        CommentController.postComment
    );

router
    .route('/:id')
    .get(
        ensureLoggedInAndCorrectTeam,
        CommentController.getComment
    )
    .patch(
        ensureLoggedInAndCorrectTeam,
        CommentController.updateComment
    )
    .delete(
        ensureLoggedInAndCorrectTeam,
        CommentController.deleteComment
    );

module.exports = router;