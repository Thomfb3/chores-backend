const Comment = require('./../models/comment');
const factory = require('../helpers/handlerFactory');
const APIFeatures = require('../helpers/apiFeatures');


exports.getAllCommentsForChore = async (req, res, next) => {
  const choreId = req.params.choreId;
  let filter = { choreId: choreId };

  const features = new APIFeatures(Comment.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  try {
    const comments = await features.query;

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        data: comments
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  const choreId = req.params.choreId;
  const date = Date.now();
  const comment = { ...req.body, choreId: choreId, date: date }
  

  try {
    const commentDoc = await Comment.create(comment);
    res.status(200).json({
      status: 'success',
      data: {
        data: commentDoc
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);


