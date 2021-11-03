const mongoose = require('mongoose');

const ChoreActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    event: {
        type: String,
        required: [true, "Chore activity requires an event"],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: [true, "Chore activity time must be recorded"],
    }
});

const ChoreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A chore must have a name"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pointValue: {
        type: Number,
        default: 100,
        required: [true, "A chore must have a point value"]
    },
    assigner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A chore must have a creator."],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        required: [true, "A chore must have a status"]
    },
    imageCover: {
        type: String,
        default: 'defaultChore.jpg'
    },
    images: [String],
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    type: [String],
    activity: [ChoreActivitySchema],
});

const Chore = mongoose.model("Chore", ChoreSchema);

module.exports = Chore;