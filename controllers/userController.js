const User = require('./../models/user');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId,
            "_id username firstName lastName currentPoints allTimePoints role profileImage")

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        next(err)
    };
};

exports.getAllUsersForTeam = async (req, res, next) => {
    try {
        //Get team id from the authorization token
        const authHeader = req.headers && req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        const teamId = jwt.decode(token).teamId;

        if (!teamId) {
            throw new BadRequestError("There must be a teamId in body of request");
        }
        const users = await User.find({ teamId: teamId },
            "_id username firstName lastName currentPoints allTimePoints role profileImage")

        res.status(200).json({
            status: 'success',
            data: users

        });
    } catch (err) {
        next(err)
    };
};


exports.updateUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({username: username});
        const authenticated = await user.authenticate(password, user.password);

        if (!authenticated) {
            throw new UnauthorizedError('Incorrect username or password');
        }

        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            profileImage: req.body.profileImage
        };

        const doc = await User.findByIdAndUpdate(user._id, userData, {
            new: true,
            runValidators: true,
            select:  "_id username firstName lastName currentPoints allTimePoints role profileImage"
        });

        if (!doc) {
            throw new NotFoundError('No document found with that ID');
        }

        res.status(200).json({
            status: 'success',
            data: doc
        });
    } catch (err) {
        next(err);
    }
}

exports.updateUserPoints = async (req, res, next) => {
    const { id } = req.params;
    const { operation, points } = req.body;
    try {
        const user = await User.findById(id);
        let updatedCurrentPoints = user.currentPoints;
        let updatedAllTimePoints = user.updatedAllTimePoints;

        if (operation === "subtract" && points > user.currentPoints) {
            throw new BadRequestError("User doesn't have enough points.");
        }
        if (operation === "subtract") {
            updatedCurrentPoints = user.currentPoints - points;
        }
        if (operation === "add") {
            updatedCurrentPoints = user.currentPoints + points;
            updatedAllTimePoints = user.allTimePoints + points;
        }
        console.log(updatedAllTimePoints)
        const doc = await User.findByIdAndUpdate(id, {currentPoints: updatedCurrentPoints, allTimePoints: updatedAllTimePoints }, {
            new: true,
            runValidators: true
        })

        if (!doc) {
            throw new NotFoundError('No document found with that ID');
        }
        res.status(200).json({
            status: 'success',
            data: doc
        });

    } catch (err) {
        next(err)
    }
}

exports.resizeUserImages = resizeImages("user");
exports.createUser = factory.createOne(User)
exports.deleteUser = factory.deleteOne(User);

