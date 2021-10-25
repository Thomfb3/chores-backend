const User = require("../models/user");
const Team = require("../models/team");
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressError");
const catchAsync = require('../helpers/catchAsync');

/** Returns JWT token which can be used to authenticate further requests.
 *  Authorization required: none **/
exports.authenticateAndGetToken = catchAsync(async (req, res, next) => {
    try {
        ///Get Username, password from request
        const { username, password } = req.body;

        //authenticate the username password and team
        const user = await User.findOne({ username: username });
        const authenticated = await user.authenticate(password, user.password);


        if (authenticated) {
            //Create token
            const token = createToken(user);
            return res.json({ token });
        }
    } catch (err) {
        return next(err);
    };
 });

/** Returns JWT token which can be used to authenticate further requests.
 *  Authorization required: none **/
exports.registerAndGetToken = catchAsync(async (req, res, next) => {
    try {
        const newUser = await User.create({ ...req.body, role: "user" });

        const token = createToken(newUser);
        return res.status(201).json({ token });

    } catch (err) {
        return next(err);
    };
 });

/* Returns JWT token which can be used to authenticate further requests.
 * Authorization required: user must be logged in **/
exports.createTeamAndGetToken = catchAsync(async (req, res, next) => {
    try {
        const { teamName, teamPassword, username } = req.body;

        //Find user, create team, add team to user and add user to team
        const user = await User.findOne({ username: username });
        const newTeam = await Team.create({ name: teamName, password: teamPassword, users: [user] });
        const updatedUser = await User.findByIdAndUpdate({ _id: user._id },
            { $set: { team: newTeam, role: "admin" } });

        const token = createToken(updatedUser);
        return res.status(201).json({ token });

    } catch (err) {
        return next(err);
    };
});

/** Returns JWT token which can be used to authenticate further requests.
 *  Authorization required: user must be logged in **/
exports.joinTeamAndGetToken = catchAsync(async (req, res, next) => {
    try {
        const { teamName, teamPassword, username } = req.body;
        const foundTeam = await Team.findOne({ name: teamName })
        const authenticated = await foundTeam.authenticate(teamPassword, foundTeam.password);

        if (authenticated) {
            const updatedUser = await User.findOneAndUpdate({ username: username },
                { $set: { team: foundTeam } });
            
            if (!updatedUser) {
                throw new BadRequestError("No user found", 401);
            };

            await Team.findByIdAndUpdate({ _id: foundTeam._id },
                { $addToSet: { users: updatedUser } });
            const token = createToken(updatedUser);
            return res.status(201).json({ token });
        } else {
            throw new BadRequestError("Invalid Team password", 401);
        }
    } catch (err) {
        return next(err);
    };
});


