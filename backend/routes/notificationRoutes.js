const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();


// Send notification to student
router.post("/notifications", async (req, res) => {

    try {

        const {
            studentId,
            courseId,
            title,
            message,
            document
        } = req.body;

        const newNotification = new Notification({

            studentId: studentId,
            courseId: courseId || null,
            title: title,
            message: message,
            document: document || "" 

        });

        await newNotification.save();

        res.status(201).json({
            message: "Notification sent successfully",
            notification: newNotification
        });

    } catch (error) {

        console.log("Notification error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Mark notification as read
router.put("/notifications/read/:id", async (req, res) => {

    try {

        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification: notification
        });

    } catch (error) {

        console.log(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Get notifications of a student
router.get("/notifications/:studentId", async (req, res) => {

    try {

        const notifications = await Notification.find({
            studentId: req.params.studentId
        })
            .populate("courseId")
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {

        console.log(
            "Get notification error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;