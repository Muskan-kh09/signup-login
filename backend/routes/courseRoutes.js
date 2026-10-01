const express = require("express");
const Course = require("../models/Course");

const router = express.Router();


// Add course
router.post("/courses", async (req, res) => {

    try {

        const {
            courseName,
            duration,
            totalFees,
            registrationFee,
            description
        } = req.body;

        const newCourse = new Course({
            courseName: courseName,
            duration: duration,
            totalFees: totalFees,
            registrationFee: registrationFee,
            description: description
        });

        await newCourse.save();

        res.status(201).json({
            message: "Course added successfully",
            course: newCourse
        });

    } catch (error) {

        console.log("Course error:", error);

        if (error.name === "ValidationError") {

            const messages = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                message: messages[0]
            });

        }

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Get all courses
router.get("/courses", async (req, res) => {

    try {

        const courses = await Course.find();

        res.status(200).json(courses);

    } catch (error) {

        console.log("Get course error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Edit course
router.put("/courses/:id", async (req, res) => {

    try {

        const {
            courseName,
            duration,
            totalFees,
            registrationFee,
            description
        } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        course.courseName = courseName;
        course.duration = duration;
        course.totalFees = totalFees;
        course.registrationFee = registrationFee;
        course.description = description;

        await course.save();

        res.status(200).json({
            message: "Course updated successfully",
            course: course
        });

    } catch (error) {

        console.log("Edit course error:", error);

        if (error.name === "ValidationError") {

            const messages = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                message: messages[0]
            });

        }

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Delete course
router.delete("/courses/:id", async (req, res) => {

    try {

        const course = await Course.findById(req.params.id);

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        console.log("Delete course error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;