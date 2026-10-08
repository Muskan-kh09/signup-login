const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    document: {
        type: String,
        default: ""
    }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;