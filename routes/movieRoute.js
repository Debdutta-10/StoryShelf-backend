const express = require("express");
const router = express.Router();
const { addMovie, updateMovie, deleteMovie, getMovies } = require("../controllers/movieController");
const { auth } = require("../middlewares/auth.js");

router.post('/addmovie', auth, addMovie);
router.put('/updatemovie/:movieId', auth, updateMovie); 
router.delete('/deletemovie/:movieId', auth, deleteMovie);
router.get('/getmovies', auth, getMovies);

module.exports = router;