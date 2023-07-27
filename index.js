const express = require("express"),
  morgan = require("morgan"),
   path = require("path");

const app = express();

app.use(morgan("common"));

let movies = [
  {
    "id": 1,
    "name": "Lord of the Rings",
    "description": "The Lord of the Rings is an epic fantasy adventure...",
    "genre": "Fantasy",
    "director": "Peter Jackson",
    "imageUrl": "https://example.com/lord_of_the_rings_poster.jpg",
    "isFeatured": true
  },
  {
    "id": 2,
    "name": "Inception",
    "description": "Inception is a mind-bending sci-fi thriller...",
    "genre": "Sci-Fi",
    "director": "Christopher Nolan",
    "imageUrl": "https://example.com/inception_poster.jpg",
    "isFeatured": false
  },
  {
    "id": 3,
    "name": "The Shawshank Redemption",
    "description": "The Shawshank Redemption is a powerful drama...",
    "genre": "Drama",
    "director": "Frank Darabont",
    "imageUrl": "https://example.com/shawshank_redemption_poster.jpg",
    "isFeatured": true
  },
  {
    "id": 4,
    "name": "Jurassic Park",
    "description": "Jurassic Park is a thrilling adventure...",
    "genre": "Action",
    "director": "Steven Spielberg",
    "imageUrl": "https://example.com/jurassic_park_poster.jpg",
    "isFeatured": false
  },
  {
    "id": 5,
    "name": "The Dark Knight",
    "description": "The Dark Knight is a gripping superhero film...",
    "genre": "Action",
    "director": "Christopher Nolan",
    "imageUrl": "https://example.com/dark_knight_poster.jpg",
    "isFeatured": true
  },
  {
    "id": 6,
    "name": "Avatar",
    "description": "Avatar is a visually stunning sci-fi epic...",
    "genre": "Sci-Fi",
    "director": "James Cameron",
    "imageUrl": "https://example.com/avatar_poster.jpg",
    "isFeatured": true
  },
  {
    "id": 7,
    "name": "Forrest Gump",
    "description": "Forrest Gump is a heartwarming drama...",
    "genre": "Drama",
    "director": "Robert Zemeckis",
    "imageUrl": "https://example.com/forrest_gump_poster.jpg",
    "isFeatured": false
  },
  {
    "id": 8,
    "name": "Interstellar",
    "description": "Interstellar is an ambitious space odyssey...",
    "genre": "Sci-Fi",
    "director": "Christopher Nolan",
    "imageUrl": "https://example.com/interstellar_poster.jpg",
    "isFeatured": true
  },
  {
    "id": 9,
    "name": "The Godfather",
    "description": "The Godfather is a classic crime drama...",
    "genre": "Crime",
    "director": "Francis Ford Coppola",
    "imageUrl": "https://example.com/the_godfather_poster.jpg",
    "isFeatured": false
  },
  {
    "id": 10,
    "name": "Gladiator",
    "description": "Gladiator is an epic historical action film...",
    "genre": "Action",
    "director": "Ridley Scott",
    "imageUrl": "https://example.com/gladiator_poster.jpg",
    "isFeatured": false
  }];

  const genres = [
    {
      "name": "Action",
      "description": "Action films are characterized by intense and exciting sequences involving physical feats, combat, stunts, and high-speed chases. They often feature a hero or protagonist facing extraordinary challenges and overcoming obstacles in thrilling and adrenaline-pumping scenarios. Action movies can encompass various sub-genres, such as martial arts, spy thrillers, superhero films, and more."
    },
    {
      "name": "Drama",
      "description": "Drama films explore complex human emotions and interpersonal relationships. They often present thought-provoking and emotional stories that can evoke a wide range of feelings in the audience. Drama movies can cover various themes, including family dynamics, personal struggles, societal issues, and more."
    }
  ];

  let users = [
    {
      "id": "user1_id",
      "name": "John Doe",
      "password": "password1"
    },
    {
      "id": "user2_id",
      "name": "Jane Smith",
      "password": "password2"
    },
    {
      "id": "user3_id",
      "name": "Alice Johnson",
      "password": "password3"
    }
  ];

app.use(express.static("public"));

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to myFlix app!");
});

app.get("/documentation", (req, res) => {
   res.sendFile("documentation.html");
   });

// Gets the list of all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:name', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.name === req.params.name }));
});

//Gets data about a genre, by name
app.get('/genres/:name', (req, res) => {
  res.json(genres.find((genre) =>
    { return genre.name === req.params.name }));
});

//Gets data about a director (bio, birth year, death year) by name
app.get('/directors/:name', (req, res) => {
  res.json(directors.find((director) =>
    { return director.name === req.params.name }));
});

//Post - Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.userName || !newUser.userPassword) {
    const message = 'Missing user name or user password in request body';
    res.status(400).send(message);
  } else {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser);
  }
});

//PUT - Allow users to update their user info (username)
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const newName = req.body.name;

  const user = users.find((user) => user.id === userId)
  if (!user){
    res.status(404).send('User with ID ' + userId + ' was not found.');
  } else {
    user.name = newName;
    res.status(201).send('Username has been updated to ' + newName);
  }
});

//POST - Allow users to add a movie to their list of favorites
app.post('users/:id/favorites', (req, res) => {
  const userId = req.params.id;
  const movieData = req.body;

  const user = users.find((user) => user.id === userId);

if(!user){
  res.status(404).send('User with the ID: ' + userId + 'was not found');
} else {
const movie = movies.find((movie) => movie.id === movieData.movieId)
  if (!movie) {
    res.status(404).send('Movie with the ID: ' + movieId + 'was not found');
  } else{
    if (!user.favorites) {
      user.favorites = [];
    }
    user.favorites.push(movieData);

    res.status(201).send('Movie ' + movie.name + ' has been added to favorites.');
  }
}
  favorites.push(movie);
res.status(201).send('Movie has been added to favorites');
});

//DELETE - Allow users to remove a movie from their list of favorites

app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    res.status(404).send('User with ID ' + userId + ' was not found.');
  } else {
    if (!user.favorites || user.favorites.length === 0) {
      res.status(404).send('User does not have any favorites.');
    } else {
      const movieIndex = user.favorites.findIndex((movie) => movie.movieId === movieId);

      if (movieIndex === -1) {
        res.status(404).send('Movie with ID ' + movieId + ' was not found in favorites.');
      } else {
        user.favorites.splice(movieIndex, 1);
        res.status(200).send('Movie with ID ' + movieId + ' has been removed from favorites.');
      }
    }
  }
});
//DELETE - Allow existing users to deregister 
app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    res.status(404).send('User with ID ' + userId + ' was not found.');
  } else {
    res.status(200).send('User with ID ' + userId + ' has been removed.');
  }
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

