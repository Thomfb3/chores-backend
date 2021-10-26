const jwt = require("jsonwebtoken");
const { createToken } = require("../../helpers/token");
const { SECRET_KEY } = require("../../config");

describe("createToken", function () {
  test("works: not admin", function () {
    const token = createToken({ username: "test", teamId: "1234567890abc", role: "user" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      teamId: "1234567890abc",
      isAdmin: false,
    });
  });

  test("works: admin", function () {
    const token = createToken({ username: "test", teamId: "1234567890abc", role: "admin" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      teamId: "1234567890abc",
      isAdmin: true,
    });
  });

  test("works: default no admin or team", function () {
    // given the security risk if this didn't work, checking this specifically
    const token = createToken({ username: "test" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      teamId: "none",
      isAdmin: false,
    });
  });
});
