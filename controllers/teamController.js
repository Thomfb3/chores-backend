const Team = require('./../models/team');
const factory = require('../helpers/handlerFactory');

exports.getTeam = factory.getOne(Team);
exports.updateTeam = factory.updateOne(Team);





