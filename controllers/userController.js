const User = require('./../models/user');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');

exports.resizeUserImages = resizeImages("user");
exports.getAllUsersForTeam = factory.getAllPerTeam(User);
exports.createUser = factory.createOne(User)
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

