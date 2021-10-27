const Reward = require('../../models/reward');
const { fakeRewardData } = require('../test-utils/fixtures.utils');

const {
    validateNotEmpty,
    validateStringEquality,
    validateNumberEquality
} = require('../test-utils/validators.utils');
const {
    dbConnect,
    dbDisconnect,
} = require('../test-utils/dbHandler.utils');

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('Reward Model Test Suite', () => {
    test('should validate saving a new Reward successfully', async () => {
        const validReward = new Reward({ ...fakeRewardData });
        const savedReward = await validReward.save();
        validateNotEmpty(savedReward);
        validateStringEquality(savedReward.title, validReward.title);
        validateStringEquality(savedReward.description, validReward.description);
        validateNumberEquality(savedReward.pointsNeeded, validReward.pointsNeeded);
        validateStringEquality(savedReward.sponsor, validReward.sponsor);
        validateStringEquality(savedReward.createdBy, validReward.createdBy);
        validateStringEquality(savedReward.status, validReward.status);
        validateStringEquality(savedReward.imageCover, validReward.imageCover);
        validateStringEquality(savedReward.teamId, validReward.teamId);
        validateStringEquality(savedReward.type, validReward.type);
        validateStringEquality(savedReward.activity[0].user, validReward.activity[0].user);
        validateStringEquality(savedReward.activity[0].event, validReward.activity[0].event);
    });

    test('should find a Reward successfully', async () => {
        const validReward = new Reward({ ...fakeRewardData });
        const savedReward = await validReward.save();
        const foundReward = await Reward.findById(savedReward._id)

        expect(foundReward).not.toBe(null);
        expect(foundReward.title).toBe(fakeRewardData.title);
        expect(foundReward.description).toBe(fakeRewardData.description);
        expect(foundReward.pointValue).toBe(fakeRewardData.pointValue);
        expect(foundReward.assigner).toStrictEqual(savedReward.assigner);
        expect(foundReward.assignee).toStrictEqual(savedReward.assignee);
        expect(foundReward.createdBy).toStrictEqual(savedReward.createdBy);
        expect(foundReward.status).toBe(fakeRewardData.status);
        expect(foundReward.imageUrl).toBe(fakeRewardData.imageUrl);
        expect(foundReward.teamId).toStrictEqual(savedReward.teamId);
        expect(foundReward.type).toStrictEqual(fakeRewardData.type);
    });

    test('should update a Reward successfully', async () => {
        const validReward = new Reward({ ...fakeRewardData });
        const savedReward = await validReward.save();
        const updates = { 
            "title": "Get $10 bucks", 
            "description": "Get ten bucks.",
            "pointsNeeded" : 600,
            "status" : "claimed",
            "imageCover" : "not-default-image.jpg",
        }
        const foundReward = await Reward.findByIdAndUpdate(savedReward._id, updates, {
            new: true,
            runValidators: true
        });
        expect(foundReward.title).toBe(updates.title);
        expect(foundReward.description).toBe(updates.description);
        expect(foundReward.pointsNeeded).toBe(updates.pointsNeeded);
        expect(foundReward.status).toBe(updates.status);
        expect(foundReward.imageCover).toBe(updates.imageCover);
    });

    test('should delete a Reward successfully', async () => {
        const validReward = new Reward({ ...fakeRewardData });
        const savedReward = await validReward.save();
        await Reward.findByIdAndDelete(savedReward._id);
        const foundReward = await Reward.findById(savedReward._id)
      
        expect(foundReward).toBe(null);
    });



});