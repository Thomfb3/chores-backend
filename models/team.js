const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "There must be a team name"],
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
});


TeamSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of BCRYPT_WORK_FACTOR
    this.password = await bcrypt.hash(this.password, BCRYPT_WORK_FACTOR);

    next();
});

TeamSchema.methods.authenticate = async function (
    candidatePassword,
    teamPassword
) {
    return await bcrypt.compare(candidatePassword, teamPassword);
};



const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;