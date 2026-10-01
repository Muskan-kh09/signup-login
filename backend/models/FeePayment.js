const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema({

    registrationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
        required: true
    },

    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    amount: {
        type: Number,
        required: true,
        min: [1, "Payment amount must be greater than 0"]
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash", "UPI", "Card", "Bank Transfer"]
    },

    remarks: {
        type: String,
        trim: true
    }

});

module.exports = mongoose.model(
    "FeePayment",
    feePaymentSchema
);