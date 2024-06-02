const mongoose = require("mongoose");
const User = require("../models/User.js");
const Movie = require("../models/Movie.js");

const addMovie = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve the user ID from req.user
        const { title, director, genre, releaseDate, status, rating, review } = req.body;
        
        // Check if required fields are provided
        if (!title || !director || !genre) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields.",
            });
        }
        
        // Create a new movie
        const movie = await Movie.create({ title, director, genre, releaseDate, status, rating, review, user: userId });

        // Update the user's movieList with the new movie
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { movieList: movie._id } },
            { new: true }
        ).populate('movieList').exec();
        updatedUser.password = undefined;

        // Send success response with updated user data
        res.status(200).json({
            success: true,
            message: "Movie added successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in adding movie:", error);
        return res.status(500).json({
            success: false,
            message: "Error in adding movie",
        });
    }
};

const getMovies = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('movieList').exec();
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        
        const movies = user.movieList;

        const completedMovies = await Movie.find({ user: userId, status: 'completed' });
        const planningMovies = await Movie.find({ user: userId, status: 'planning' });
        
        res.status(200).json({
            success: true,
            message: "Movies retrieved successfully",
            movies,
            completedMovies,
            planningMovies
        });
    } catch (error) {
        console.error("Error in retrieving movies:", error);
        return res.status(500).json({
            success: false,
            message: "Error in retrieving movies",
        });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const userId = req.user.id;
        const {movieId} = req.params;

        if (!movieId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide movie ID and user ID.",
            });
        }

        // Check if the movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found.",
            });
        }

        // Remove the movie from the user's movieList
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { movieList: movieId } },
            { new: true }
        ).populate('movieList').exec();

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Delete the movie from the database
        const deletedMovie = await Movie.findByIdAndDelete(movieId);
        if (!deletedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found in the database.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in deleting movie:", error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting movie",
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const { title, director, genre, releaseDate, status, rating, review } = req.body;

        // Check if the required fields are provided
        if (!title || !director || !genre) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields.",
            });
        }

        // Find the movie by ID and update its details
        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { title, director, genre, releaseDate, status, rating, review },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            movie: updatedMovie,
        });
    } catch (error) {
        console.error("Error in updating movie:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating movie",
        });
    }
};

module.exports = { addMovie, updateMovie, deleteMovie, getMovies };