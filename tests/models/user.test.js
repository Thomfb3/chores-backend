const User = require('../../models/user');
const { fakeUserData } = require('../fixtures/fixtures');
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
  test('should validate saving a new student user successfully', async () => {
      console.log({...fakeUserData})
    const validUser = new User({...fakeUserData });
    const savedUser = await validUser.save();

    validateNotEmpty(savedUser);

    validateStringEquality(savedUser.email, fakeUserData.email);
    validateStringEquality(
      savedUser.username,
      fakeUserData.username
    );
    validateStringEquality(
      savedUser.firstName,
      fakeUserData.firstName
    );
  });

//   test('should validate MongoError duplicate error with code 11000', async () => {
//     expect.assertions(4);
//     const validStudentUser = new User({
//       local: fakeUserData,
//       role: fakeUserData.role,
//     });

//     try {
//       await validStudentUser.save();
//     } catch (error) {
//       const { name, code } = error;
//       validateMongoDuplicationError(name, code);
//     }
//   });
});