const mongoose = require("mongoose");
const User = require("../models/User.js");
const Book = require("../models/Book.js");

const addBook = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve the user ID from req.user
        const { title, author, genre, status, rating, review } = req.body;
        
        // Check if required fields are provided
        if (!title || !author || !genre) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields.",
            });
        }
        
        // Create a new book
        const book = await Book.create({ title, author, genre, status, rating, review, user: userId });

        // Update the user's bookList with the new book
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { bookList: book._id } },
            { new: true }
        ).populate('bookList').exec();
        updatedUser.password = undefined;

        // Send success response with updated user data
        res.status(200).json({
            success: true,
            message: "Book added successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in adding book:", error);
        return res.status(500).json({
            success: false,
            message: "Error in adding book",
        });
    }
};

const getBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('bookList').exec();
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        
        const books = user.bookList;

        const completedBooks = await Book.find({ user: userId, status: 'completed' });
        const planningBooks = await Book.find({ user: userId, status: 'planning' });
        
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            books,
            completedBooks,
            planningBooks
        });
    } catch (error) {
        console.error("Error in retrieving books:", error);
        return res.status(500).json({
            success: false,
            message: "Error in retrieving books",
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const {bookId} = req.params;
        console.log(userId);
        console.log(bookId);

        if (!bookId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide book ID and user ID.",
            });
        }

        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found.",
            });
        }

        // Remove the book from the user's bookList
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { bookList: bookId } },
            { new: true }
        ).populate('bookList').exec();

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Delete the book from the database
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found in the database.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in deleting book:", error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting book",
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { title, author, genre, status, rating, review } = req.body;

        // Check if the required fields are provided
        if (!title || !author || !genre) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields.",
            });
        }

        // Find the book by ID and update its details
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { title, author, genre, status, rating, review },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error in updating book:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating book",
        });
    }
};

module.exports = { addBook, updateBook, deleteBook, getBooks };