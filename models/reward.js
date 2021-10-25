const mongoose = require('mongoose');

const RewardActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    event: {
        type: String,
        required: [true, "Reward activity requires an event"],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: [true, "Reward activity time must be recorded"],
    }
});

const RewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A Reward must have a title"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pointsNeeded: {
        type: Number,
        default: 100,
        required: [true, "A Reward must have a point value"]
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Someone must sponsor the reward"]
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Someone must have create the reward"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    status: {
        type: String,
        required: [true, "A chore must have a status"]
    },
    imageCover: {
        type: String,
        default: 'defaultChore.jpg'
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    type: [String],
    activity: [RewardActivitySchema],
});

const Reward = mongoose.model("Reward", RewardSchema);

module.exports = Reward;