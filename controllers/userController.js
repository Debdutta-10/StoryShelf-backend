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

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userWithoutSensitiveData,  // Send the modified user object
                message: "User successfully logged in",
            });
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

module.exports = { signupUser, loginUser };
