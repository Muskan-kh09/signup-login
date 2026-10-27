const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");

const router = express.Router();


// =============================
// SIGNUP
// =============================

router.post("/signup", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: "student"
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {

        console.log("Signup error:", error.message);

        res.status(500).json({
            message: "Server error"
        });

    }
});


// =============================
// LOGIN
// =============================

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(400).json({
                message: "Email not registered"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // Find matching student record
        const student = await Student.findOne({
            email: user.email
        });

        // Get user role
        const role = user.role || "student";

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send login response
        res.status(200).json({
            message: "Login successful",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,

                studentId:
                    role === "student" && student
                        ? student._id
                        : null
            }
        });

    } catch (error) {

        console.log("Login error:", error.message);

        res.status(500).json({
            message: "Server error"
        });

    }
});


module.exports = router;