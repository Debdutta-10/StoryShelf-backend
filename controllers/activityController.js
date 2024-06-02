const mongoose = require("mongoose");
const User = require("../models/User.js");
const Book = require("../models/Book.js");
const SharedActivity = require("../models/Activity.js");

const shareBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        // Save the shared activity to the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const sharedActivity = await SharedActivity.create({
            type: 'book',
            activityId: bookId,
            userId: userId,
            timestamp: new Date()
        });

        // Fetch book details
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book shared successfully",
            sharedActivity: {
                type: sharedActivity.type,
                activityId: sharedActivity.activityId,
                userId: sharedActivity.userId,
                timestamp: sharedActivity.timestamp,
                bookName: book.title, // Include book name in response
                username: user.username // Include username in response
            }
        });
    } catch (error) {
        console.error("Error in sharing book activity:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sharing book activity",
        });
    }
};


// Controller function to share a movie
const shareMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        // Save the shared movie activity to the database
        const sharedActivity = await SharedActivity.create({
            type: 'movie',
            activityId: movieId,
            userId,
            timestamp: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Movie shared successfully",
            sharedActivity,
        });
    } catch (error) {
        console.error("Error in sharing movie:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sharing movie",
        });
    }
};

const getActivity = async (req, res) => {
    try {
        // Query all shared activities
        const activities = await SharedActivity.find().populate('userId', 'username').exec();

        // Check if any activities were found
        if (!activities || activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No shared activities found.",
            });
        }

        // Return the activities
        res.status(200).json({
            success: true,
            message: "Shared activities retrieved successfully",
            activities,
        });
    } catch (error) {
        console.error("Error in retrieving shared activities:", error);
        return res.status(500).json({
            success: false,
            message: "Error in retrieving shared activities",
        });
    }
};

module.exports = {shareBook,shareMovie,getActivity};