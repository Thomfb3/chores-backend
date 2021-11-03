const User = require('./../models/user');
const { resizeImages } = require('../helpers/handlerFileUpload');
const factory = require('../helpers/handlerFactory');

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId,
            "_id username firstName lastName points role profileImage")

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
            "_id username firstName lastName points role profileImage")

        res.status(200).json({
            status: 'success',
            data: users
            
        });
    } catch (err) {
        next(err)
    };
};


exports.resizeUserImages = resizeImages("user");
exports.createUser = factory.createOne(User)
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

