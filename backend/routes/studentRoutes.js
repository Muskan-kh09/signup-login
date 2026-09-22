const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Add student
router.post("/students", async (req, res) => {

    console.log("Student API called");

    try {

        const { name, email, phone, course, city, image } = req.body;

        const newStudent = new Student({
            name: name,
            email: email,
            phone: phone,
            course: course,
            city: city,
            image: image
        });

        await newStudent.save();
        console.log("Student saved:", newStudent);

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent
        });

    } catch (error) {

        console.log("Student error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;