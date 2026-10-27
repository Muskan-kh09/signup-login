const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {

    try {

        // Check authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Please login first"
            });

        }

        // Get token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user in database
        const user = await User.findById(
            decoded.id
        ).select("_id name email role");

        if (!user) {

            return res.status(401).json({
                message: "User not found"
            });

        }

        // Store authenticated user information
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "student"
        };

        next();

    } catch (error) {

        console.log("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

module.exports = authMiddleware;