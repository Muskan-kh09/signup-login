const express = require("express");
const Certificate = require("../models/Certificate");
const multer = require("multer");

const router = express.Router();


// Certificate file upload
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({
    storage: storage
});


// Add certificate
router.post(
    "/certificates",
    upload.single("certificate"),
    async (req, res) => {

        try {

            const {
                studentId,
                courseId,
                certificateNumber,
                issueDate
            } = req.body;


            if (!studentId) {

                return res.status(400).json({
                    message: "Please select student"
                });

            }


            if (!courseId) {

                return res.status(400).json({
                    message: "Please select course"
                });

            }


            if (!certificateNumber) {

                return res.status(400).json({
                    message: "Please enter certificate number"
                });

            }


            if (!issueDate) {

                return res.status(400).json({
                    message: "Please select issue date"
                });

            }


            if (!req.file) {

                return res.status(400).json({
                    message: "Please upload certificate"
                });

            }


            const existingCertificate =
                await Certificate.findOne({
                    certificateNumber:
                        certificateNumber
                });


            if (existingCertificate) {

                return res.status(400).json({
                    message:
                        "Certificate number already exists"
                });

            }


            const newCertificate =
                new Certificate({

                    studentId: studentId,

                    courseId: courseId,

                    certificateNumber:
                        certificateNumber,

                    issueDate: issueDate,

                    certificate:
                        req.file.filename

                });


            await newCertificate.save();


            res.status(201).json({

                message:
                    "Certificate added successfully",

                certificate:
                    newCertificate

            });

        } catch (error) {

            console.log(
                "Certificate error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });

        }

    }
);

// Get all certificates
router.get("/certificates", async (req, res) => {

    try {

        const certificates = await Certificate.find()
            .populate("studentId")
            .populate("courseId")
            .sort({ createdAt: -1 });

        res.status(200).json(certificates);

    } catch (error) {

        console.log(
            "Get certificate error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Get certificates of a student
router.get(
    "/certificates/student/:studentId",
    async (req, res) => {

        try {

            const certificates = await Certificate.find({
                studentId: req.params.studentId
            })
                .populate("courseId")
                .sort({ createdAt: -1 });

            res.status(200).json(certificates);

        } catch (error) {

            console.log(
                "Student certificate error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });

        }

    }
);

module.exports = router;