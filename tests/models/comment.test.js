const Comment = require('../../models/comment');
const { fakeCommentData } = require('../test-utils/fixtures.utils');
const {
    validateNotEmpty,
    validateStringEquality,
} = require('../test-utils/validators.utils');
const {
    dbConnect,
    dbDisconnect,
} = require('../test-utils/dbHandler.utils');

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('Comment Model Test Suite', () => {
    test('should validate saving a new Comment successfully', async () => {
        const validComment = new Comment({ ...fakeCommentData });
        const savedComment = await validComment.save();
        validateNotEmpty(savedComment);
        validateStringEquality(savedComment.user, validComment.user);
        validateStringEquality(savedComment.comment, validComment.comment);
        validateStringEquality(savedComment.choreId, validComment.choreId);
    });

    test('should find a Comment successfully', async () => {
        const validComment = new Comment({ ...fakeCommentData });
        const savedComment = await validComment.save();
        const foundComment = await Comment.findById(savedComment._id)

        expect(foundComment).not.toBe(null);
        expect(foundComment.user).toStrictEqual(savedComment.user);
        expect(foundComment.comment).toEqual(fakeCommentData.comment);
        expect(foundComment.choreId).toStrictEqual(savedComment.choreId);
    });

    test('should update a Comment successfully', async () => {
        const validComment = new Comment({ ...fakeCommentData });
        const savedComment = await validComment.save();
        const updates = { "comment" : "I mean I love chores"};
        const foundComment = await Comment.findByIdAndUpdate(savedComment._id, updates, {
            new: true,
            runValidators: true
          });
      
        expect(foundComment.comment).toBe("I mean I love chores");
    });

    test('should delete a Comment successfully', async () => {
        const validComment = new Comment({ ...fakeCommentData });
        const savedComment = await validComment.save();
        await Comment.findByIdAndDelete(savedComment._id);
        const foundComment = await Comment.findById(savedComment._id)
      
        expect(foundComment).toBe(null);
    });

});