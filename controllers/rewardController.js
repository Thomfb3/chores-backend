const Reward = require('./../models/reward');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');

//Create reward that also posts the reward created activity
exports.createReward = async (req, res, next) => {
    try {
        const reward = await Reward.create(req.body);
        const activity = { user: reward.createdBy, event: 'Reward created.' }
        const rewardWithActivity = await Reward.findByIdAndUpdate(
            reward._id,
            {
                $push: { activity: activity }
            });

        res.status(201).json({
            status: 'success',
            data: {
                data: rewardWithActivity
            }
        });
    } catch (err) {
        next(err)
    }
};

//Other reward route functions
exports.resizeRewardImages = resizeImages("rewards");
exports.getAllRewardsForTeam = factory.getAllPerTeam(Reward);
exports.oneRewardCreatedActivity = factory.oneCreatedActivity(Reward);
exports.getReward = factory.getOne(Reward);
exports.updateReward = factory.updateOne(Reward);
exports.updateRewardStatusActivity = factory.updateOneStatusActivity(Reward);
exports.updateRewardInfoActivity = factory.updateOneInfoActivity(Reward);
exports.deleteReward = factory.deleteOne(Reward);




