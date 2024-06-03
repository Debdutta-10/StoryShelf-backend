const express = require("express");
const router = express.Router();
const { addMovie, updateMovie, deleteMovie, getMovies, getMoviebyId} = require("../controllers/movieController");
const { auth } = require("../middlewares/auth.js");
const {shareMovie} = require("../controllers/activityController.js");

router.post('/addmovie', auth, addMovie);
router.put('/updatemovie/:movieId', auth, updateMovie); 
router.delete('/deletemovie/:movieId', auth, deleteMovie);
router.get('/getmovies', auth, getMovies);
router.get('/getmovie/:movieId',getMoviebyId);
router.post('/share/movie/:movieId', auth, shareMovie);

module.exports = router;