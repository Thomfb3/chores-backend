const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */
function createToken(user) {
  // console.assert(user.role === undefined,
  //     "createToken passed user without role property");
  
  let payload = {
    username: user.username,
    userId: user._id,
    teamId: user.teamId || "none",
    isAdmin: user.role === "admin",
  };
  return jwt.sign(payload, SECRET_KEY);
}


module.exports = { createToken };