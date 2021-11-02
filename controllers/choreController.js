const Chore = require('./../models/chore');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');

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
            data: {
                data: choreWithActivity
            }
        });
    } catch (err) {
        next(err)
    }
};

exports.getAllChoresForUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const chores = await Chore.find({ assignee: userId })

        res.status(201).json({
            status: 'success',
            data: {
                data: chores
            }
        });
    } catch (err) {
        next(err)
    }
};

//Other chore route functions
exports.resizeChoreImages = resizeImages("chores");
exports.getAllChoresForTeam = factory.getAllPerTeam(Chore);
exports.getChore = factory.getOne(Chore);
exports.updateChore = factory.updateOne(Chore);
exports.updateChoreStatusActivity = factory.updateOneStatusActivity(Chore);
exports.updateChoreInfoActivity = factory.updateOneInfoActivity(Chore);
exports.deleteChore = factory.deleteOne(Chore);




