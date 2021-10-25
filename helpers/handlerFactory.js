const catchAsync = require('./catchAsync');
const APIFeatures = require('./apiFeatures');
const { BadRequestError, NotFoundError } = require("../expressError");
const jwt = require("jsonwebtoken");


exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new NotFoundError('No document found with that ID'));
    }

    res.status(200).json({
      status: 'success',
      data: { message: "Deleted!", }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new NotFoundError('No document found with that ID'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new BadRequestError('No document found with that ID'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAllPerTeam = Model =>
  catchAsync(async (req, res, next) => {
    //Get team id from the authorization token
    const authHeader = req.headers && req.headers.authorization;
    const token = authHeader.replace(/^[Bb]earer /, "").trim();
    const teamId = jwt.decode(token).teamId;

    let filter = {};
    if (!teamId) {
      return next(new BadRequestError("There must be a teamId in body of request"));
    }

    filter = { team: teamId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

exports.oneCreatedActivity = (Model, modelName, id) =>
  catchAsync(async (req, res, next) => {
    const user = res.locals.user;

    const activity = { user: user.username, event: `${modelName} created` }

    const doc = await Model.findByIdAndUpdate(
      id,
      {
        $push: { activity: activity }
      });

    if (!doc) {
      return next(new NotFoundError('No document found with that ID'));
    };

    next();
  });


exports.updateOneStatusActivity = Model =>
  catchAsync(async (req, res, next) => {
    const statusUpdate = req.body.status ? req.body.status : null;
    const user = res.locals.user;

    if (statusUpdate) {
      let activity = { user: user.username, event: `status updated to ${req.body.status}` };

      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        {
          $push: { activity: activity }
        });

      if (!doc) {
        return next(new NotFoundError('No document found with that ID'));
      };
    }

    next();
  });

exports.updateOneInfoActivity = Model =>
  catchAsync(async (req, res, next) => {

    let updates = []
    for (var keys in req.body) updates.push(keys);
    const activity = { user: "61722f1f7b4914ef4000a533", event: `Updates: ${updates.join(", ")}` }

    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      {
        $push: { activity: activity }
      });

    if (!doc) {
      return next(new NotFoundError('No document found with that ID'));
    };

    next();
  });
