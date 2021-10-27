const UserController = require("../../controllers/userController");
const User = require("../../models/user");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/newUser.json");

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

    it("should have a createTodo function", () => {
        expect(typeof UserController.createUser).toBe("function");
    });
    it("should call TodoModel.create", () => {
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
                data: {
                    data: newUser
                }
            }
        );
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);

        User.create.mockReturnValue(rejectedPromise);
        await UserController.createUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});
