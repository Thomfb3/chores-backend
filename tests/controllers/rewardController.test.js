const RewardController = require("../../controllers/rewardController");
const Reward = require("../../models/reward");
const httpMocks = require("node-mocks-http");
const newReward = require("../mock-data/newReward.json");

jest.mock('../../models/reward');

let req, res, next;

const rewardId = "5d5ecb5a6e598605f06cb945";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});


describe("RewardController.createChore", () => {
    beforeEach(() => {
        req.body = newReward;
    });

    it("should have a createReward function", () => {
        expect(typeof RewardController.createReward).toBe("function");
    });
    it("should call Reward Model create", () => {
        RewardController.createReward(req, res, next);
        expect(Reward.create).toBeCalledWith(newReward);
    });
    it("should return 201 response code", async () => {
        await RewardController.createReward(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeFalsy();
    });

});

describe("RewardController.getReward", () => {
    it("should have a getReward function", () => {
        expect(typeof RewardController.getReward).toBe("function");
    });
    it("should call Reward Model create", async () => {
        req.params.id = rewardId;
        await RewardController.getReward(req, res, next);
        expect(Reward.findById).toBeCalledWith(rewardId);
    });
    it("should return json body and response code 200", async () => {
        Reward.findById.mockReturnValue(newReward);
        await RewardController.getReward(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().data.data.title).toContain(newReward.title);
        expect(res._isEndCalled()).toBeTruthy();
    });
});


describe("RewardController.getAllRewardForTeam", () => {
    it("should have a getAllRewardForTeam function", () => {
        expect(typeof RewardController.getAllRewardsForTeam).toBe("function");
    });
    it("should return json body and response code 200", async () => {
        Reward.find.mockReturnValue(newReward);
        await RewardController.getAllRewardsForTeam(req, res, next);
        expect(res.statusCode).toBe(200);
    });
});

describe("RewardController.updateReward", () => {
    it("should have a updateReward function", () => {
        expect(typeof RewardController.updateReward).toBe("function");
    });
    it("should update with RewardController.findByIdAndUpdate", async () => {
        req.params.id = rewardId;
        req.body = newReward;
        await RewardController.updateReward(req, res, next);
        expect(Reward.findByIdAndUpdate).toHaveBeenCalledWith(rewardId, newReward, {
            "new": true,
            "runValidators": true
        });
    });
    it("should return a response with json data and http code 200", async () => {
        req.params.id = rewardId;
        req.body = newReward;
        Reward.findByIdAndUpdate.mockReturnValue(newReward);
        await RewardController.updateReward(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().data.data.title).toContain(newReward.title);
    });
});


describe("RewardController.deleteReward", () => {
    it("should have a deleteReward function", () => {
        expect(typeof RewardController.deleteReward).toBe("function");
    });
    it("should call findByIdAndDelete", async () => {
        req.params.id = rewardId;
        await RewardController.deleteReward(req, res, next);
        expect(Reward.findByIdAndDelete).toBeCalledWith(rewardId);
    });
    it("should return 200 OK and deleted Chore model", async () => {
        Reward.findByIdAndDelete.mockReturnValue(newReward);
        await RewardController.deleteReward(req, res, next);
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
        Reward.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await RewardController.deleteReward(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});