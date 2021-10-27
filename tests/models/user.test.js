const User = require('../../models/user');
const { 
    fakeUserData, 
    fakeUserData2,
    fakeUserData3,
    fakeUserData4
} = require('../test-utils/fixtures.utils');
const {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError,
} = require('../test-utils/validators.utils');
const {
    dbConnect,
    dbDisconnect,
} = require('../test-utils/dbHandler.utils');

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('User Model Test Suite', () => {
    test('should validate saving a new User successfully', async () => {
        const validUser = new User({ ...fakeUserData });
        const savedUser = await validUser.save();

        validateNotEmpty(savedUser);
        validateStringEquality(savedUser.email, fakeUserData.email);
        validateStringEquality(savedUser.username, fakeUserData.username);
        validateStringEquality(savedUser.firstName, fakeUserData.firstName);
    });

    test('should validate MongoError duplicate error with code 11000', async () => {
        expect.assertions(4);
        const duplicateUsername = new User({ ...fakeUserData });
        try {
            await duplicateUsername.save();
        } catch (error) {
            const { name, code } = error;
            validateMongoDuplicationError(name, code);
        }
    });

    test('should find a User successfully', async () => {
        const validUser = new User({ ...fakeUserData2 });
        const savedUser = await validUser.save();
        const foundUser = await User.findById(savedUser._id)

        expect(foundUser).not.toBe(null);
        expect(foundUser.username).toEqual(fakeUserData2.username);
        expect(foundUser.firstName).toEqual(fakeUserData2.firstName);
        expect(foundUser.lastName).toEqual(fakeUserData2.lastName);
        expect(foundUser.email).toEqual(fakeUserData2.email);
    });

    test('should update a User successfully', async () => {
        const validUser = new User({ ...fakeUserData3 });
        const savedUser = await validUser.save();
        const updates = { "lastName": "Last", "firstName": "Tester" };
        const foundUser = await User.findByIdAndUpdate(savedUser._id, updates, {
            new: true,
            runValidators: true
        });

        expect(foundUser.username).toBe("testUser3");
        expect(foundUser.email).toBe("test3@user.com");
        expect(foundUser.lastName).toBe(updates.lastName);
        expect(foundUser.firstName).toBe(updates.firstName);
    });

    test('should delete a User successfully', async () => {
        const validUser = new User({ ...fakeUserData4 });
        const savedUser = await validUser.save();
        await User.findByIdAndDelete(savedUser._id);
        const foundUser = await User.findById(savedUser._id)
    
        expect(foundUser).toBe(null);
    });

});