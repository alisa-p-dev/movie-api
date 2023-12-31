/**
 * The secret key used for JWT token generation.
 * @type {string}
 */
const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates a JWT token for a user.
 *
 * @param {object} user - The user object to encode in the JWT.
 * @returns {string} The JWT token.
 * @function
 * @memberof module:auth
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * Express route for handling user login.
 *
 * @param {object} router - The Express router.
 * @function
 * @memberof module:auth
 */
module.exports = (router) => {
  /**
   * Handles POST requests to '/login'.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
