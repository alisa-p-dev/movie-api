/**
 * Express application for the myFlix app.
 * @module app
 */

const express = require("express"),
  morgan = require("morgan"),
  path = require("path"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;

/**
 * Connects to the MongoDB database using the provided CONNECTION_URI.
 * @function
 * @memberof app
 */
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("common"));

app.use(express.static("public"));

const cors = require("cors");
const allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://flixmoviverse.netlify.app",
  "http://localhost:4200",
  "https://alisa-p-dev.github.io",
];

/**
 * Configures CORS for the application to allow specific origins.
 * @function
 * @memberof app
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    allowedHeaders: "*",
  })
);

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

/**
 * Handles the root endpoint with a welcome message.
 * @function
 * @memberof app
 */
app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

/**
 * Serves the documentation HTML page.
 * @function
 * @memberof app
 */
app.get("/documentation", (req, res) => {
  res.sendFile("documentation.html");
});

/**
 * Retrieves the list of all movies.
 * @function
 * @memberof app
 */
app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

/**
 * Retrieves data about a single movie by its ID.
 * @function
 * @memberof app
 */
app.get(
  "/movies/:_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ _id: req.params._id })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Retrieves data about a genre by its name.
 * @function
 * @memberof app
 */
app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const genreName = req.params.Name;
    await Movies.findOne({ "Genre.Name": genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Retrieves data about a director (bio, birth year, death year) by their name.
 * @function
 * @memberof app
 */
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const directorName = req.params.Name;
    await Movies.findOne({ "Director.Name": directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Allows new users to register.
 * @function
 * @memberof app
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Retrieves a user by their username.
 * @function
 * @memberof app
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Updates a user's information by their username.
 * @function
 * @memberof app
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Adds a movie to a user's list of favorites.
 * @function
 * @memberof app
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((User) => {
        res.json(User);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Allows users to remove a movie from their list of favorites.
 * @function
 * @memberof app
 */
app.delete(
  "/users/:Username/movies/:MovieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieId } },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Deletes a user by their username.
 * @function
 * @memberof app
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Error handling middleware to log errors and respond with a 500 Internal Server Error.
 * @function
 * @memberof app
 */
app.use((err, req, res, next) => {
  // Log the error to the terminal
  console.error("Application-level error:", err.stack);

  // Respond with a 500 Internal Server Error to the client
  res.status(500).send("Something went wrong on the server!");
});

/**
 * Starts the server and listens for requests.
 * @function
 * @memberof app
 */
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
