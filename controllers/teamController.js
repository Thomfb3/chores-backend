const Team = require('./../models/team');
const factory = require('../helpers/handlerFactory');

exports.getTeam = async (req, res, next) => {
    try {
        const teamId = req.params.id
        const team = await Team.findById(teamId, "_id name")

        res.status(200).json({
            status: 'success',
            data: team
        });
    } catch (err) {
        next(err)
    };
};

exports.updateTeam = factory.updateOne(Team);





