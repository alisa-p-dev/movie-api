/**
 * Mongoose schema for a movie.
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie.
 * @property {string} Description - The description of the movie.
 * @property {Object} Genre - The genre of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - The description of the genre.
 * @property {Object} Director - The director of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - The biography of the director.
 * @property {string[]} Actors - An array of actor names.
 * @property {string} ImagePath - The path to the movie's image.
 * @property {boolean} Featured - Indicates if the movie is featured.
 */

/**
 * Mongoose schema for a user.
 * @typedef {Object} UserSchema
 * @property {string} Username - The username of the user.
 * @property {string} Password - The hashed password of the user.
 * @property {string} Email - The email address of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {mongoose.Types.ObjectId[]} FavoriteMovies - An array of favorite movie IDs.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Mongoose schema for a movie.
 * @type {mongoose.Schema}
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * Mongoose schema for a user.
 * @type {mongoose.Schema}
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes a user's password using bcrypt.
 *
 * @param {string} password - The user's password to be hashed.
 * @returns {string} The hashed password.
 * @function
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password against a stored hashed password using bcrypt.
 *
 * @param {string} password - The user's password to be validated.
 * @returns {boolean} True if the password is valid; otherwise, false.
 * @function
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Mongoose model for movies.
 * @type {mongoose.Model}
 */
let Movie = mongoose.model("Movie", movieSchema);

/**
 * Mongoose model for users.
 * @type {mongoose.Model}
 */
let User = mongoose.model("User", userSchema);

/**
 * Exports the Movie and User models for use in other modules.
 * @module models
 */
module.exports.Movie = Movie;
module.exports.User = User;
