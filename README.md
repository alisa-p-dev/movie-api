# Movie API

This is a Node.js project built with Express which contains the entire API for the myFlix Application.

## Prerequisites

- Install Node.js
- Install MongoDB

## Installation

1. Clone the repository.
2. Navigate to the project directory in the terminal.
3. Run `npm install` to install the necessary dependencies.
4. Set up the MongoDB database and tables.

## Technologies Used

- Node.js
- Express
- Mongoose (MongoDB)

## Defining Endpoints

1. **Return all movies** - READ endpoint:

   `/movies`

2. **Return movie by title** - READ endpoint:

   `/movies/:title`

3. **Return genre by genre name** - READ endpoint:

   `/movies/genre/:genreName`

4. **Return data about a director by name** - READ endpoint:

   `/directors/:directorName`

5. **Allow new users to register** - CREATE endpoint:

   `/users`

6. **Allow users to update their username** - UPDATE endpoint:

   `/users/:Username`

7. **Allow users to add a movie to their list of favorites** - UPDATE/CREATE endpoint:

   `/users/:Username/:MovieId`

8. **Allow users to remove a movie from their list of favorites** - DELETE endpoint:

   `/users/:Username/:MovieId`

9. **Allow existing users to deregister** - DELETE endpoint:

   `/users/:Username`
