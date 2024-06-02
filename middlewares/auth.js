const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Missing Token",
            });
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload; 
            console.log(req.user);// Set the user information in the request object
            next(); 
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Auth",
        });
    }
};
