const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User must have a username."],
        unique: true,
        minlength: 5
    },
    firstName: {
        type: String,
        required: [true, "We need a first name"]
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    currentPoints: {
        type: Number,
        default: 0
    },
    allTimePoints: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'deleted'],
        default: 'user'
    },
    profileImage: {
        type: String,
        default: 'defaultProfile.jpg'
    },
    chores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chore"
        }
    ],
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
});



UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of BCRYPT_WORK_FACTOR
    this.password = await bcrypt.hash(this.password, BCRYPT_WORK_FACTOR);

    next();
});


// UserSchema.pre(/^find/, function (next) {
//     // this points to the current query
//     this.find({ active: { $ne: false } });
//     next();
// });


UserSchema.methods.authenticate = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};




const User = mongoose.model("User", UserSchema);

module.exports = User;