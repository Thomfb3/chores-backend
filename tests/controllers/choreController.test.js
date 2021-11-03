const ChoreController = require("../../controllers/choreController");
const Chore = require("../../models/chore");
const httpMocks = require("node-mocks-http");
const newChore = require("../mock-data/newChore.json");

jest.mock('../../models/chore');

let req, res, next;

const choreId = "5d5ecb5a6e598605f06cb945";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});


describe("ChoreController.createChore", () => {
    beforeEach(() => {
        req.body = newChore;
    });

    it("should have a createChore function", () => {
        expect(typeof ChoreController.createChore).toBe("function");
    });
    it("should call Chore Model create", () => {
        ChoreController.createChore(req, res, next);
        expect(Chore.create).toBeCalledWith(newChore);
    });
    it("should return 201 response code", async () => {
        await ChoreController.createChore(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeFalsy();
    });

});

describe("ChoreController.getChore", () => {
    it("should have a getChore function", () => {
        expect(typeof ChoreController.getChore).toBe("function");
    });
    it("should call Chore Model create", async () => {
        req.params.id = choreId;
        await ChoreController.getChore(req, res, next);
        expect(Chore.findById).toBeCalledWith(choreId);
    });
    it("should return json body and response code 200", async () => {
        Chore.findById.mockReturnValue(newChore);
        await ChoreController.getChore(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().data.title).toContain(newChore.title);
        expect(res._isEndCalled()).toBeTruthy();
    });
});


describe("ChoreController.getAllChoresForTeam", () => {
    it("should have a getAllChoresForTeam function", () => {
        expect(typeof ChoreController.getAllChoresForTeam).toBe("function");
    });
    it("should return json body and response code 200", async () => {
        Chore.find.mockReturnValue(newChore);
        await ChoreController.getAllChoresForTeam(req, res, next);
        expect(res.statusCode).toBe(200);
    });
});

describe("ChoreController.updateChore", () => {
    it("should have a updateUser function", () => {
        expect(typeof ChoreController.updateChore).toBe("function");
    });
    it("should update with ChoreController.findByIdAndUpdate", async () => {
        req.params.id = choreId;
        req.body = newChore;
        await ChoreController.updateChore(req, res, next);
        expect(Chore.findByIdAndUpdate).toHaveBeenCalledWith(choreId, newChore, {
            "new": true,
            "runValidators": true
        });
    });
    it("should return a response with json data and http code 200", async () => {
        req.params.id = choreId;
        req.body = newChore;
        Chore.findByIdAndUpdate.mockReturnValue(newChore);
        await ChoreController.updateChore(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().data.title).toContain(newChore.title);
    });
});


describe("ChoreController.deleteChore", () => {
    it("should have a deleteUser function", () => {
        expect(typeof ChoreController.deleteChore).toBe("function");
    });
    it("should call findByIdAndDelete", async () => {
        req.params.id = choreId;
        await ChoreController.deleteChore(req, res, next);
        expect(Chore.findByIdAndDelete).toBeCalledWith(choreId);
    });
    it("should return 200 OK and deleted Chore model", async () => {
        Chore.findByIdAndDelete.mockReturnValue(newChore);
        await ChoreController.deleteChore(req, res, next);
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
        Chore.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await ChoreController.deleteChore(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});