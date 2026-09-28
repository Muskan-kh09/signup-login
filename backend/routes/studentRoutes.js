const express = require("express");
const Student = require("../models/Student");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Add student
router.post("/students", upload.single("image"), async (req, res) => {

    console.log("Student API called");

    try {

        const { name, email, phone, course, city } = req.body;

        const newStudent = new Student({
            name: name,
            email: email,
            phone: phone,
            course: course,
            city: city,
            image: req.file.filename
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


// Get all students
router.get("/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {

        console.log("Get student error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;