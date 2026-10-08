const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },

    issueDate: {
        type: Date,
        required: true
    },

    certificate: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Certificate",
    certificateSchema
);