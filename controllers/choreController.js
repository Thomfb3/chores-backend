const Chore = require('./../models/chore');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');
const jwt = require("jsonwebtoken");

//Create chore that also posts the chore created activity
exports.createChore = async (req, res, next) => {
    try {
        const chore = await Chore.create(req.body);
        const activity = { user: chore.createdBy, event: 'Chore created.' }
        const choreWithActivity = await Chore.findByIdAndUpdate(
            chore._id,
            {
                $push: { activity: activity }
            });

        res.status(201).json({
            status: 'success',
            data: choreWithActivity

        });
    } catch (err) {
        next(err)
    };
};

exports.getAllChoresForUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const chores = await Chore.find({ assignee: userId },
            '_id title description pointValue assignee assigner createdAt status dueDate')

        res.status(200).json({
            status: 'success',
            data: chores
        });
    } catch (err) {
        next(err)
    };
};

exports.getAllChoresForTeam = async (req, res, next) => {
    try {
        //Get team id from the authorization token
        const authHeader = req.headers && req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        const teamId = jwt.decode(token).teamId;

        if (!teamId) {
            throw new BadRequestError("There must be a teamId in body of request");
        }

        const chores = await Chore.find({ teamId: teamId },
            '_id title pointValue assignee status dueDate').
            populate("assignee", "profileImage firstName");

        res.status(200).json({
            status: 'success',
            results: chores.length,
            data: {
                chores
            }
        });
    } catch (err) {
        next(err)
    }
};


exports.getUnclaimedChoresForTeam = async (req, res, next) => {
    try {
        //Get team id from the authorization token
        const authHeader = req.headers && req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        const teamId = jwt.decode(token).teamId;

        if (!teamId) {
            throw new BadRequestError("There must be a teamId in body of request");
        }

        const chores = await Chore.find({ teamId: teamId, assignee: null },
            '_id title description pointValue status dueDate')

        res.status(200).json({
            status: 'success',
            results: chores.length,
            data: chores
        });
    } catch (err) {
        next(err)
    }
};

//Other chore route functions
exports.resizeChoreImages = resizeImages("chores");
exports.getChore = factory.getOne(Chore);
exports.updateChore = factory.updateOne(Chore);
exports.updateChoreStatusActivity = factory.updateOneStatusActivity(Chore);
exports.updateChoreInfoActivity = factory.updateOneInfoActivity(Chore);
exports.deleteChore = factory.deleteOne(Chore);




