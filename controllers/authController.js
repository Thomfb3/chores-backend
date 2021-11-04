const User = require("../models/user");
const Team = require("../models/team");
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressError");
const catchAsync = require('../helpers/catchAsync');

/** Returns JWT token which can be used to authenticate further requests.
 *  Authorization required: none **/
exports.authenticateAndGetToken = catchAsync(async (req, res, next) => {
    try {
        const { username, password } = req.body;
        //authenticate the username and password
        const user = await User.findOne({ username: username });
        const authenticated = await user.authenticate(password, user.password);

        if (authenticated) {
            //Return token with username and team if user has team
            const token = createToken(user);
            return res.json({ token });
        };
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
        //Return token token with username and no team
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
        //Find user
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new BadRequestError("Username not found", 401);
        }
        //Create team and add user to team
        const newTeam = await Team.create({ name: teamName, password: teamPassword, users: [user] });
        //Add team to user and make user admin
        const updatedUser = await User.findByIdAndUpdate({ _id: user._id },
            { $set: { teamId: newTeam, role: "admin" } }, {new: true});
    
        //Return token with teamId now added
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
        //Find team
        const foundTeam = await Team.findOne({ name: teamName })
        if (!foundTeam) {
            throw new BadRequestError("Team not found", 401)
        }
        //Authenticate teamName and  teamPassword
        const authenticated = await foundTeam.authenticate(teamPassword, foundTeam.password);
        if (authenticated) {
            //Add team to user
            const updatedUser = await User.findOneAndUpdate({ username: username },
                { $set: { teamId: foundTeam } }, {new: true});
            if (!updatedUser) {
                throw new BadRequestError("No user found", 401);
            };
            //Add user to team
            await Team.findByIdAndUpdate({ _id: foundTeam._id },
                { $addToSet: { users: updatedUser } }, {new: true});
            //Return token with teamId now added
            const token = createToken(updatedUser);
            return res.status(201).json({ token });
        } else {
            throw new BadRequestError("Invalid Team password", 401);
        }
    } catch (err) {
        return next(err);
    };
});


