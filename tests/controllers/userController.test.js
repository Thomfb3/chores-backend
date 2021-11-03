const UserController = require("../../controllers/userController");
const User = require("../../models/user");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/newUser.json");
const allUsers = require("../mock-data/allUsers.json");

jest.mock('../../models/user');

let req, res, next;

const userId = "5d5ecb5a6e598605f06cb945";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});


describe("UserController.createUser", () => {
    beforeEach(() => {
        req.body = newUser;
    });

    it("should have a createUser function", () => {
        expect(typeof UserController.createUser).toBe("function");
    });
    it("should call User Model create", () => {
        UserController.createUser(req, res, next);
        expect(User.create).toBeCalledWith(newUser);
    });
    it("should return 201 response code", async () => {
        await UserController.createUser(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return json body in response", async () => {
        User.create.mockReturnValue(newUser);
        await UserController.createUser(req, res, next);
        expect(res._getJSONData()).toStrictEqual(
            {
                status: 'success',
                data: newUser
            }
        );
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);

        User.create.mockReturnValue(rejectedPromise);
        await UserController.createUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("UserController.getUser", () => {
    it("should have a createUser function", () => {
        expect(typeof UserController.getUser).toBe("function");
    });
    it("should call User Model create", async () => {
        req.params.id = userId;
        await UserController.getUser(req, res, next);
        expect(User.findById).toBeCalledWith(userId, "_id username firstName lastName points role profileImage");
    });
    it("should return json body and response code 200", async () => {
        User.findById.mockReturnValue(newUser);
        await UserController.getUser(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(
            {
                status: 'success',
                data:  newUser
            }
        );
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);

        User.findById.mockReturnValue(rejectedPromise);
        await UserController.getUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

});


describe("UserController.getAllUsersForTeam", () => {
    it("should have a createUser function", () => {
        expect(typeof UserController.getAllUsersForTeam).toBe("function");
    });
    it("should return json body and response code 200", async () => {
        User.find.mockReturnValue(allUsers);
        await UserController.getAllUsersForTeam(req, res, next);
        expect(res.statusCode).toBe(200);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        User.findById.mockReturnValue(rejectedPromise);
        await UserController.getUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

});

describe("UserController.updateUser", () => {
    it("should have a updateUser function", () => {
        expect(typeof UserController.updateUser).toBe("function");
    });
    it("should update with User.findByIdAndUpdate", async () => {
        req.params.id = userId;
        req.body = newUser;
        await UserController.updateUser(req, res, next);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, newUser, {
            "new": true,
            "runValidators": true
        });
    });
    it("should return a response with json data and http code 200", async () => {
        req.params.id = userId;
        req.body = newUser;
        User.findByIdAndUpdate.mockReturnValue(newUser);
        await UserController.updateUser(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(
            {
                status: 'success',
                data:  newUser
            }
        );
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Error" };
        const rejectedPromise = Promise.reject(errorMessage);
        User.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await UserController.updateUser(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});


describe("UserController.deleteUser", () => {
    it("should have a deleteUser function", () => {
        expect(typeof UserController.deleteUser).toBe("function");
    });
    it("should call findByIdAndDelete", async () => {
        req.params.id = userId;
        await UserController.deleteUser(req, res, next);
        expect(User.findByIdAndDelete).toBeCalledWith(userId);
    });
    it("should return 200 OK and deleted user model", async () => {
        User.findByIdAndDelete.mockReturnValue(newUser);
        await UserController.deleteUser(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(
            {
                status: 'success',
                data: { message: "Deleted!", }
            }
        );
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Error deleting" };
        const rejectedPromise = Promise.reject(errorMessage);
        User.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await UserController.deleteUser(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});