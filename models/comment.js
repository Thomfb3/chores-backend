const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Comment must have an owner."],
    },
    comment: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now(),
        required: [true, "Comment time must be recorded."],
    },
    choreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chore"
    },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;