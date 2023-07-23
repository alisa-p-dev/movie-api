const express = require("express"),
  morgan = require("morgan");
  const path = require("path");

const app = express();

app.use(morgan("common"));

let topMovies = [
  {
    title: "The Godfather",
    year: "1972",
  },
  {
    title: "Pulp Fiction",
    year: "1994",
  },
  {
    title: "Forrest Gump",
    year: "1994",
  },
  {
    title: "Fight Club",
    year: "1999",
  },
  {
    title: "Inception",
    year: "2010",
  },
  { title: "The Silence of the Lambs", 
  year: "1991" },
  { title: "Life Is Beautiful", year: "1997" },
  { title: "The Pianist", year: "2002" },
  { title: "Leon", year: "1994" },
  { title: "A Beautiful Mind", year: "2001" },
];

app.use(express.static(path.join(__dirname, "public")));

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("documentation.html", { root: path.join(__dirname, "public") });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error to the terminal
  console.error("Application-level error:", err.stack);

  // Respond with a 500 Internal Server Error to the client
  res.status(500).send("Something went wrong on the server!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

