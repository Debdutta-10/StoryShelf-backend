const mongoose = require("mongoose");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signupUser = async (req, res) => {
    try {
        const { username, email, password, genres, favoriteAuthors, favoriteDirectors } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields carefully.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            genres: Array.isArray(genres) ? genres : [genres],
            favoriteAuthors: Array.isArray(favoriteAuthors) ? favoriteAuthors : [favoriteAuthors],
            favoriteDirectors: Array.isArray(favoriteDirectors) ? favoriteDirectors : [favoriteDirectors]
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User successfully signed up",
            user: {
                username: newUser.username,
                email: newUser.email,
                genres: newUser.genres,
                favoriteAuthors: newUser.favoriteAuthors,
                favoriteDirectors: newUser.favoriteDirectors
            }
        });

    } catch (error) {
        console.error("Error in signing up:", error);
        return res.status(500).json({
            success: false,
            message: "Error in signing up",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields carefully.",
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Signup first!",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            const payload = {
                username: user.username,
                email: user.email,
                id: user._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "10h",
            });

            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            const userWithoutSensitiveData = {
                _id: user._id,
                username: user.username,
                email: user.email,
                bookList: user.bookList,
                movieList: user.movieList,
                genres: user.genres,
                favoriteAuthors: user.favoriteAuthors,
                favoriteDirectors: user.favoriteDirectors,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token: token
            };

            // Remove sensitive data
            user.password = undefined;

            return res.status(200).json({
                success: true,
                token,
                user: userWithoutSensitiveData,  // Send the modified user object
                message: "User successfully logged in",
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in login",
        });
    }
};


const addUserFavAuthors = async (req, res) => {
    try {
        const userId = req.user.id;
        const { author } = req.body;

        if (!author) {
            return res.status(400).json({
                success: false,
                message: "Please provide an author to add.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.favoriteAuthors.includes(author)) {
            return res.status(400).json({
                success: false,
                message: "Author already in the favorite list.",
            });
        }

        user.favoriteAuthors.push(author);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Author added to favorite list successfully.",
            favoriteAuthors: user.favoriteAuthors,
        });
    } catch (error) {
        console.error("Error adding favorite author:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding favorite author.",
        });
    }
};

const addUserFavDirectors = async (req, res) => {
    try {
        const userId = req.user.id;
        const { director } = req.body;

        if (!director) {
            return res.status(400).json({
                success: false,
                message: "Please provide a director to add.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.favoriteDirectors.includes(director)) {
            return res.status(400).json({
                success: false,
                message: "Director already in the favorite list.",
            });
        }

        user.favoriteDirectors.push(director);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Director added to favorite list successfully.",
            favoriteDirectors: user.favoriteDirectors,
        });
    } catch (error) {
        console.error("Error adding favorite director:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding favorite director.",
        });
    }
};

const addUserGenres = async (req, res) => {
    try {
        const userId = req.user.id;
        const { genre } = req.body;

        if (!genre) {
            return res.status(400).json({
                success: false,
                message: "Please provide genre(s) to add.",
            });
        }

        const genresArray = genre.split(',');

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        for (const g of genresArray) {
            if (!user.genres.includes(g)) {
                user.genres.push(g);
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Genres added to list successfully.",
            genres: user.genres,
        });
    } catch (error) {
        console.error("Error adding genre:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding genre.",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "User found successfully",
            user,
        });
    } catch (error) {
        console.error("Error in finding user:", error);
        res.status(500).json({
            message: "Error in finding user",
            error: error.message,
        });
    }
};


module.exports = { signupUser, loginUser, addUserFavAuthors, addUserFavDirectors, addUserGenres, getUserById };
