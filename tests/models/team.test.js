const Team = require('../../models/team');
const User = require('../../models/user');
const { 
    fakeTeamData,
    fakeTeamData2,
    fakeTeamData3,
    fakeTeamData4,  
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

describe('Team Model Test Suite', () => {
    test('should validate saving a new Team successfully', async () => {
        const validUser = new User({...fakeUserData});
        const savedUser = await validUser.save();

        const validTeam = new Team({...fakeTeamData, users: [savedUser._id]});
        const savedTeam = await validTeam.save();

        validateNotEmpty(savedTeam);
        validateStringEquality(savedTeam.name, fakeTeamData.name);
        validateStringEquality(savedTeam.users, [savedUser._id] );
    });

    test('should validate MongoError duplicate error with code 11000', async () => {
        expect.assertions(4);
        const duplicateTeamName = new Team({...fakeTeamData });
        try {
            await duplicateTeamName.save();
        } catch (error) {
            const { name, code } = error;
            validateMongoDuplicationError(name, code);
        }
    });

    test('should find a Team successfully', async () => {
        const validUser = new User({...fakeUserData2});
        const savedUser = await validUser.save();

        const validTeam = new Team({...fakeTeamData2, users: [savedUser._id]});
        const savedTeam = await validTeam.save();

        const foundTeam = await Team.findById(savedTeam._id)

        expect(foundTeam).not.toBe(null);
        expect(foundTeam.name).toEqual(fakeTeamData2.name);
        expect(foundTeam.users).toEqual([savedUser._id]);

    });

    test('should update a Team successfully', async () => {
        const validUser = new User({ ...fakeUserData3 });
        const savedUser = await validUser.save();
        const validTeam = new Team({...fakeTeamData3, users: [savedUser._id]});
        const savedTeam = await validTeam.save();
        const validUser2 = new User({ ...fakeUserData4 });
        const savedUser2 = await validUser2.save();
        await Team.updateOne({_id: savedTeam._id},{ $push: { users: savedUser2._id} })
        const foundTeam = await Team.findById(savedTeam._id)
    
        expect(foundTeam.name).toBe("Test3");
        expect(foundTeam.users.length).toBe(2);
    });

    test('should delete a Team successfully', async () => {
        const validTeam = new Team({ ...fakeTeamData4 });
        const savedTeam = await validTeam.save();
        await Team.findByIdAndDelete(savedTeam._id);
        const foundUser = await Team.findById(savedTeam._id)
    
        expect(foundUser).toBe(null);
    });

});