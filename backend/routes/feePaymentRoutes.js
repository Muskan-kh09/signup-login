const express = require("express");
const FeePayment = require("../models/FeePayment");
const Registration = require("../models/Registration");

const router = express.Router();


// Add Fee Payment
router.post("/fee-payments", async (req, res) => {

    try {

        const {
            registrationId,
            paymentDate,
            amount,
            paymentMethod,
            remarks
        } = req.body;


        // Find registration
        const registration = await Registration.findById(
            registrationId
        );

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }


        // Check payment amount
        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Payment amount must be greater than 0"
            });
        }


        // Check remaining fees
        if (Number(amount) > Number(registration.remainingFees)) {

            return res.status(400).json({
                message:
                    "Payment amount cannot be greater than remaining fees"
            });

        }


        // Save payment
        const newPayment = new FeePayment({

            registrationId: registrationId,

            paymentDate:
                paymentDate || Date.now(),

            amount: Number(amount),

            paymentMethod: paymentMethod,

            remarks: remarks
        });


        await newPayment.save();


        // Update remaining fees
        registration.remainingFees =
            Number(registration.remainingFees) -
            Number(amount);


        // Update payment status
        if (registration.remainingFees === 0) {
            registration.status = "Paid";
        } else if (
            registration.remainingFees <
            registration.totalFees
        ) {
            registration.status = "Partial";
        } else {
            registration.status = "Pending";
        }
        await registration.save();


        res.status(201).json({

            message: "Fee payment added successfully",

            payment: newPayment,

            remainingFees:
                registration.remainingFees
        });

    } catch (error) {

        console.log(
            "Fee payment error:",
            error
        );


        if (error.name === "ValidationError") {

            const messages =
                Object.values(error.errors).map(
                    (err) => err.message
                );


            return res.status(400).json({
                message: messages[0]
            });

        }


        res.status(500).json({
            message: "Server error"
        });

    }

});


// Get all Fee Payments
router.get("/fee-payments", async (req, res) => {

    try {

        const payments =
            await FeePayment.find()
                .populate({
                    path: "registrationId",
                    populate: [
                        {
                            path: "studentId"
                        },
                        {
                            path: "courseId"
                        }
                    ]
                })
                .sort({
                    paymentDate: -1
                });


        res.status(200).json(payments);

    } catch (error) {

        console.log(
            "Get fee payments error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;