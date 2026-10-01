const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true,
        trim: true
    },

    duration: {
        type: String,
        required: true,
        trim: true
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

    description: {
        type: String,
        required: true,
        trim: true
    }

});


// Registration fee cannot be greater than total fees
courseSchema.pre("validate", function (next) {

    if (this.registrationFee > this.totalFees) {

        this.invalidate(
            "registrationFee",
            "Registration fee cannot be greater than total fees"
        );

    }

    next();

});


module.exports = mongoose.model("Course", courseSchema);