const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // Retrieve token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Missing or invalid Authorization header",
            });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Missing Token",
            });
        }
        
        try {
            // Verify the token
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
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
