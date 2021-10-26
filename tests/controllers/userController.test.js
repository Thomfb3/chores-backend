const UserController = require("../../controllers/userController");
const httpMocks = require("node-mocks-http");
const UserModel = require("../../models/user");
const newUser = require("../mock-data/newUser.json");

const deleted = {
       "data": {
         "message": "Deleted!",
       },
      "status": "success",
    }

jest.mock("../../models/user");

let req, res, next;
const userId = "5d5ecb5a6e598605f06cb945";


beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("Delete User", () => {
    it("should have deleteUser function", () => {
        expect(typeof UserController.deleteUser).toBe("function");
    });
    it("should call findByIdAndDelete", async () => {
        req.params.id = userId;
        await UserController.deleteUser(req, res, next);
        expect(UserModel.findByIdAndDelete).toBeCalledWith(userId);
    });
    it("should return 200 OK and deleted user", async () => {
        UserModel.findByIdAndDelete.mockReturnValue(newUser);
        await UserController.deleteUser(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deleted);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle 404", async () => {
        req.params.id = "123DUMMY";
        
        await UserController.deleteUser(req, res, next);

        //expect(res).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});


describe("Delete User", () => {
    it("should have deleteUser function", () => {
        expect(typeof UserController.deleteUser).toBe("function");
    });
    it("should call findByIdAndDelete", async () => {
        req.params.id = userId;
        await UserController.deleteUser(req, res, next);
        expect(UserModel.findByIdAndDelete).toBeCalledWith(userId);
    });
    it("should return 200 OK and deleted user", async () => {
        UserModel.findByIdAndDelete.mockReturnValue(newUser);
        await UserController.deleteUser(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deleted);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle 404", async () => {
        req.params.id = "123DUMMY";
        
        await UserController.deleteUser(req, res, next);
  
        //expect(res).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});





