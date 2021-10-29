const UserController = require("../../controllers/userController");
const AuthController = require("../../controllers/authController");
const User = require("../../models/user");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/newUser.json");
const allUsers = require("../mock-data/allUsers.json");

jest.mock('../../models/user');

let req, res, next;

const userId = "5d5ecb5a6e598605f06cb945";
const teamId = "6170e09c2be022483d798c44";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});


describe("AuthController.authenticateAndGetToken", () => {
    beforeEach(() => {

    });

    it("should have a authenticateAndGetToken function", () => {
        expect(typeof AuthController.authenticateAndGetToken).toBe("function");
    });
    it("should call Auth Model authenticate", () => {
        req.body = {
            "username": "Test123",
            "password": "password"
        };
        AuthController.authenticateAndGetToken(req, res, next);
        expect(User.findOne).toBeCalledWith({
            "username": "Test123"
        });
    });
    it("should return 201 response code", async () => {
        await AuthController.authenticateAndGetToken(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeFalsy();
    });
});

describe("AuthController.registerAndGetToken", () => {
    beforeEach(() => {
        req.body = newUser;
    });
    it("should have a authenticateAndGetToken function", () => {
        expect(typeof AuthController.registerAndGetToken).toBe("function");
    });
    it("should call Auth Model authenticate", () => {
        AuthController.registerAndGetToken(req, res, next);
        expect(User.create).toBeCalledWith({...newUser, "role": "user"});
    });
    it("should return 201 response code", async () => {
        await AuthController.registerAndGetToken(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeFalsy();
    });
});

describe("AuthController.createTeamAndGetToken", () => {
    it("should have a createTeamAndGetToken function", () => {
        expect(typeof AuthController.createTeamAndGetToken).toBe("function");
    });
});

describe("AuthController.joinTeamAndGetToken", () => {
    it("should have a updateUser function", () => {
        expect(typeof AuthController.joinTeamAndGetToken).toBe("function");
    });
});
