const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    latitude: {
        type: Number,
        required: false
    },

    longitude: {
        type: Number,
        required: false
    },

    distance: {
        type: Number,
        required: false
    }

});

module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);