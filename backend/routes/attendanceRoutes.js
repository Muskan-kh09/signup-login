const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

const INSTITUTE_LATITUDE = 31.315364;
const INSTITUTE_LONGITUDE = 75.588858;
const ATTENDANCE_RADIUS = 100;

    const toRadians = (degree) => {
        return degree * (Math.PI / 180);
    };

    const calculateDistance = (
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) => {

        const earthRadius = 6371000;

        const latitudeDifference =
            toRadians(latitude2 - latitude1);

        const longitudeDifference =
            toRadians(longitude2 - longitude1);

        const a =
            Math.sin(latitudeDifference / 2) *
            Math.sin(latitudeDifference / 2) +
            Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(longitudeDifference / 2) *
            Math.sin(longitudeDifference / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return earthRadius * c;
    };

// Add Attendance
router.post("/attendance", async (req, res) => {

    try {

        const {
            studentId,
            date,
            status,
            latitude,
            longitude
        } = req.body;


        // Check Location
        if (
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({
                message: "Location is required to mark attendance"
            });

        }

        // Calculate Distance From Institute
        const distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            INSTITUTE_LATITUDE,
            INSTITUTE_LONGITUDE
        );

        console.log(
            "Attendance location distance:",
            Math.round(distance),
            "meters"
        );


        // Allow Attendance Only Within 100 Meters
        if (distance > ATTENDANCE_RADIUS) {

            return res.status(403).json({
                message:
                    `Attendance allowed only within 100 meters. Your distance is ${Math.round(distance)} meters.`
            });

        }


        // Create Attendance
        const newAttendance = new Attendance({
            studentId: studentId,
            date: date,
            status: status,
            latitude: Number(latitude),
            longitude: Number(longitude),
            distance: Math.round(distance)
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

// Today's Attendance Stats
router.get("/attendance/today", async (req, res) => {

    try {

        const today = new Date().toISOString().split("T")[0];

        const attendance = await Attendance.find({
            date: today
        });

        let present = 0;
        let absent = 0;

        attendance.forEach((record) => {

            if (record.status === "Present") {
                present++;
            }

            if (record.status === "Absent") {
                absent++;
            }

        });

        res.status(200).json({
            date: today,
            present: present,
            absent: absent
        });

    } catch (error) {

        console.log("Today attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Overall Attendance
router.get("/attendance/overall", async (req, res) => {
    try {
        const attendance = await Attendance.find();

        let total = attendance.length;
        let present = 0;
        let absent = 0;

        attendance.forEach((record) => {

            if (record.status === "Present") {
                present++;
            }

            if (record.status === "Absent") {
                absent++;
            }

        });

        let percentage = 0;

        if (total > 0) {
            percentage = (present / total) * 100;
        }

        res.status(200).json({
            total: total,
            present: present,
            absent: absent,
            percentage: percentage
        });

    } catch (error) {

        console.log(
            "Overall attendance error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }
});


// Student Wise Attendance With Date Range
router.get(
    "/attendance/student/:studentId/:fromDate/:toDate",
    async (req, res) => {
        try {
            const attendance = await Attendance.find({
                studentId: req.params.studentId,
                date: {
                    $gte: req.params.fromDate,
                    $lte: req.params.toDate
                }
            }).populate("studentId");

            let total = attendance.length;
            let present = 0;
            let absent = 0;

            attendance.forEach((record) => {
                if (record.status === "Present") {
                    present++;
                }

                if (record.status === "Absent") {
                    absent++;
                }
            });

            let percentage = 0;

            if (total > 0) {
                percentage = (present / total) * 100;
            }

            res.status(200).json({
                student:
                    attendance.length > 0
                        ? attendance[0].studentId
                        : null,
                total: total,
                present: present,
                absent: absent,
                percentage: percentage,
                records: attendance
            });
        } catch (error) {
            console.log(
                "Student date range attendance error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);

// Date Wise Attendance
router.get("/attendance/date/:date", async (req, res) => {

    try {

        const attendance = await Attendance.find({
            date: req.params.date
        }).populate("studentId");

        res.status(200).json(attendance);

    } catch (error) {

        console.log("Date attendance error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

module.exports = router;