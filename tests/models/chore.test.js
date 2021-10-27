const Chore = require('../../models/chore');
const { fakeChoreData } = require('../test-utils/fixtures.utils');

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

describe('Chore Model Test Suite', () => {
    test('should validate saving a new Chore successfully', async () => {
        const validChore = new Chore({ ...fakeChoreData });
        const savedChore = await validChore.save();
        validateNotEmpty(savedChore);
        validateStringEquality(savedChore.title, validChore.title);
        validateStringEquality(savedChore.description, validChore.description);
        validateNumberEquality(savedChore.pointValue, validChore.pointValue);
        validateStringEquality(savedChore.assigner, validChore.assigner);
        validateStringEquality(savedChore.assignee, validChore.assignee);
        validateStringEquality(savedChore.createdBy, validChore.createdBy);
        validateStringEquality(savedChore.status, validChore.status);
        validateStringEquality(savedChore.imageUrl, validChore.imageUrl);
        validateStringEquality(savedChore.teamId, validChore.teamId);
        validateStringEquality(savedChore.type, validChore.type);
    });

    test('should find a Chore successfully', async () => {
        const validChore = new Chore({ ...fakeChoreData });
        const savedChore = await validChore.save();
        const foundChore = await Chore.findById(savedChore._id)

        expect(foundChore).not.toBe(null);
        expect(foundChore.title).toBe(fakeChoreData.title);
        expect(foundChore.description).toBe(fakeChoreData.description);
        expect(foundChore.pointValue).toBe(fakeChoreData.pointValue);
        expect(foundChore.assigner).toStrictEqual(savedChore.assigner);
        expect(foundChore.assignee).toStrictEqual(savedChore.assignee);
        expect(foundChore.createdBy).toStrictEqual(savedChore.createdBy);
        expect(foundChore.status).toBe(fakeChoreData.status);
        expect(foundChore.imageUrl).toBe(fakeChoreData.imageUrl);
        expect(foundChore.teamId).toStrictEqual(savedChore.teamId);
        expect(foundChore.type).toStrictEqual(fakeChoreData.type);
    });

    test('should update a Chore successfully', async () => {
        const validChore = new Chore({ ...fakeChoreData });
        const savedChore = await validChore.save();
        const updates = { 
            "title": "Clean the upstairs bathroom", 
            "description": "Don't clean the wrong bathroom.",
            "pointValue" : 200,
            "status" : "submitted",
            "imageCover" : "not-default-image.jpg"
        }
        const foundChore = await Chore.findByIdAndUpdate(savedChore._id, updates, {
            new: true,
            runValidators: true
        });
        expect(foundChore.title).toBe(updates.title);
        expect(foundChore.description).toBe(updates.description);
        expect(foundChore.pointValue).toBe(updates.pointValue);
        expect(foundChore.status).toBe(updates.status);
        expect(foundChore.imageCover).toBe(updates.imageCover);
        expect(foundChore.type[0]).toBe("template");
    });

    test('should delete a Chore successfully', async () => {
        const validChore = new Chore({ ...fakeChoreData });
        const savedChore = await validChore.save();
        await Chore.findByIdAndDelete(savedChore._id);
        const foundChore = await Chore.findById(savedChore._id)
    
        expect(foundChore).toBe(null);
    });


});