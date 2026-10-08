const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    document: {
        type: String,
        default: ""
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);