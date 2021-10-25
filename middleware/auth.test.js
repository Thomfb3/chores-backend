"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureLoggedInAndCorrectTeam,
  ensureCorrectUserAndCorrectTeam,
  ensureAdmin,
  ensureAdminAndCorrectTeam,
  ensureCorrectUserOrAdmin,
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign(
  {
    username: "test",
    teamId: "1234567890abc",
    isAdmin: false
  },
  SECRET_KEY);

const testAdminJwt = jwt.sign(
  {
    username: "test",
    teamId: "1234567890abc",
    isAdmin: true
  },
  SECRET_KEY);

const badSecretJwt = jwt.sign(
  {
    username: "test",
    teamId: "1234567890abc",
    isAdmin: false
  },
  "wrong");



describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        teamId: "1234567890abc",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token with bad secret", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badSecretJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});


describe("ensureLoggedInAndCorrectTeam", function () {
  test("works", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedInAndCorrectTeam(req, res, next);
  });

  test("unauth if no auth header", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedInAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong team id", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "WRONG67890def", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedInAndCorrectTeam(req, res, next);
  });

});



describe("ensureCorrectUserAndCorrectTeam", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {
      headers: { authorization: `Bearer ${testJwt}` },
      params: { username: "test" }
    };

    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserAndCorrectTeam(req, res, next);
  });

  test("unauth if no auth header", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong secret key", function () {
    expect.assertions(1);
    const req = {
      headers: { authorization: `Bearer ${badSecretJwt}` },
      params: { username: "test" }
    };
    const res = { locals: { user: { username: "test", teamId: "WRONG67890def", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong team id", function () {
    expect.assertions(1);
    const req = {
      headers: { authorization: `Bearer ${testJwt}` },
      params: { username: "test" }
    };
    const res = { locals: { user: { username: "test", teamId: "WRONG67890def", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong username", function () {
    expect.assertions(1);
    const req = {
      headers: { authorization: `Bearer ${testJwt}` },
      params: { username: "test" }
    };
    const res = { locals: { user: { username: "wrong", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserAndCorrectTeam(req, res, next);
  });

});


describe("ensureAdmin", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if not admin", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if anon", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});


describe("ensureAdminAndCorrectTeam", function () {
  test("works", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testAdminJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminAndCorrectTeam(req, res, next);
  });

  test("unauth if not admin", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong team", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "WRONG7890def", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminAndCorrectTeam(req, res, next);
  });

  test("unauth if wrong secret key", function () {
    expect.assertions(1);
    const req = { headers: { authorization: `Bearer ${badSecretJwt}` } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminAndCorrectTeam(req, res, next);
  });

  test("unauth if anon", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminAndCorrectTeam(req, res, next);
  });
});


describe("ensureCorrectUserOrAdmin", function () {
  test("works: admin", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "admin", teamId: "1234567890abc", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works: same user", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: mismatch", function () {
    expect.assertions(1);
    const req = { params: { username: "wrong" } };
    const res = { locals: { user: { username: "test", teamId: "1234567890abc", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: if anon", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
});
