const express = require("express");

const app = express();
app.use(express.json());
const movieControllers = require("./controllers/movieControllers");
const usercontrollers = require("./controllers/usercontrollers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", usercontrollers.getusers);
app.get("/api/users/:id", usercontrollers.getusersid);
app.post("/api/movies", movieControllers.postMovie);
app.post("/api/users", usercontrollers.Postusers);
module.exports = app;
