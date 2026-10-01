const express = require("express");
const Registration = require("../models/Registration");
const Student = require("../models/Student");
const Course = require("../models/Course");

const router = express.Router();


// Add Registration
router.post("/registrations", async (req, res) => {

    try {

        const {
            studentId,
            courseId,
            registrationDate,
            registrationFee
        } = req.body;


        // Check student
        const student = await Student.findById(studentId);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        // Check course
        const course = await Course.findById(courseId);

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }


        // Registration fee cannot be greater than total fees
        if (Number(registrationFee) > Number(course.totalFees)) {

            return res.status(400).json({
                message:
                    "Registration fee cannot be greater than total fees"
            });

        }


        const remainingFees =
            Number(course.totalFees) -
            Number(registrationFee);


        let status = "Pending";
        if (remainingFees === 0) {
            status = "Paid";
        } else if (
            remainingFees < course.totalFees
        ) {
            status = "Partial";
        }

        const newRegistration = new Registration({
            studentId: studentId,
            courseId: courseId,
            registrationDate:
                registrationDate || Date.now(),
            totalFees: course.totalFees,
            registrationFee:
                Number(registrationFee),
            remainingFees:
                remainingFees,
            status:
                status
        });

        await newRegistration.save();


        res.status(201).json({

            message: "Student registered successfully",

            registration: newRegistration

        });

    } catch (error) {

        console.log("Registration error:", error);

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


// Get all registrations
router.get("/registrations", async (req, res) => {

    try {

        const registrations = await Registration.find()
            .populate("studentId")
            .populate("courseId");

        res.status(200).json(registrations);

    } catch (error) {

        console.log("Get registration error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;