const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

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

    registrationDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    totalFees: {
        type: Number,
        required: true,
        min: [1, "Total fees must be greater than 0"]
    },

    registrationFee: {
        type: Number,
        required: true,
        min: [0, "Registration fee cannot be negative"]
    },

    remainingFees: {
        type: Number,
        required: true,
        min: [0, "Remaining fees cannot be negative"]
    },

    status: {
        type: String,
        enum: ["Pending", "Partial", "Paid"],
        default: "Pending"
    }

});

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);