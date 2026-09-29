const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();


// Add Attendance
router.post("/attendance", async (req, res) => {

    try {

        const { studentId, date, status } = req.body;

        const newAttendance = new Attendance({
            studentId: studentId,
            date: date,
            status: status
        });

        await newAttendance.save();

        res.status(201).json({
            message: "Attendance added successfully",
            attendance: newAttendance
        });

    } catch (error) {

        console.log("Attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Get All Attendance
router.get("/attendance", async (req, res) => {

    try {

        const attendance = await Attendance.find()
            .populate("studentId");

        res.status(200).json(attendance);

    } catch (error) {

        console.log("Get attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Put All Attendance
router.put("/attendance/:id", async (req, res) => {

    try {

        const { studentId, date, status } = req.body;

        const attendance = await Attendance.findById(
            req.params.id
        );

        if (!attendance) {

            return res.status(404).json({
                message: "Attendance not found"
            });

        }

        attendance.studentId = studentId;
        attendance.date = date;
        attendance.status = status;

        await attendance.save();

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance: attendance
        });

    } catch (error) {

        console.log("Update attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Delete All Attendance

router.delete("/attendance/:id", async (req, res) => {

    try {

        const attendance = await Attendance.findByIdAndDelete(
            req.params.id
        );

        if (!attendance) {

            return res.status(404).json({
                message: "Attendance not found"
            });

        }

        res.status(200).json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        console.log("Delete attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Attendance Summary
router.get("/attendance/summary", async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("studentId");

        const summary = {};

        attendance.forEach((record) => {
            if (!record.studentId) {
                return;
            }

            const studentId = record.studentId._id.toString();

            if (!summary[studentId]) {
                summary[studentId] = {
                    studentId: studentId,
                    name: record.studentId.name,
                    total: 0,
                    present: 0,
                    absent: 0
                };
            }

            summary[studentId].total++;

            if (record.status === "Present") {
                summary[studentId].present++;
            }

            if (record.status === "Absent") {
                summary[studentId].absent++;
            }
        });

        const result = Object.values(summary);

        result.forEach((student) => {
            student.percentage =
                (student.present / student.total) * 100;
        });

        res.status(200).json(result);

    } catch (error) {
        console.log("Attendance summary error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;