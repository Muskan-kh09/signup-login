const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();
        console.log("User saved:", newUser);
        
        res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// login
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

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

        res.status(200).json({
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }
});

module.exports = router;