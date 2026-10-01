function FeeReceipt({ payment, setPage }) {

    if (!payment) {
        return (
            <div className="fee-receipt-page">

                <div className="fee-receipt-container">

                    <h2>Receipt not found</h2>

                    <button
                        onClick={() => setPage("fee-payment")}
                    >
                        Back to Fee Payment
                    </button>

                </div>

            </div>
        );
    }


    const studentName =
        payment.registrationId?.studentId?.name || "-";

    const courseName =
        payment.registrationId?.courseId?.courseName || "-";

    const studentEmail =
        payment.registrationId?.studentId?.email || "-";

    const studentPhone =
        payment.registrationId?.studentId?.phone || "-";

    const paymentStatus =
        payment.registrationId?.status ||
        (
            payment.registrationId?.remainingFees === 0
                ? "Paid"
                : "Partial"
        );


    return (

        <div className="fee-receipt-page">

            <div className="fee-receipt-container">

                {/* Header */}

                <div className="receipt-header">

                    <div className="receipt-logo">
                        🎓
                    </div>

                    <div>
                        <h1>Student Management System</h1>

                        <p>
                            Fee Payment Receipt
                        </p>
                    </div>

                </div>


                {/* Receipt Title */}

                <div className="receipt-title">
                    <h2>PAYMENT RECEIPT</h2>
                    <span>
                        Official Fee Receipt
                    </span>
                    <div className="receipt-number">
                        Receipt No:{" "}
                        {payment._id
                            ? `REC-${payment._id.slice(-8).toUpperCase()}`
                            : "N/A"
                        }
                    </div>
                </div>


                {/* Student Details */}

                <div className="receipt-section">

                    <h3>
                        Student Details
                    </h3>

                    <div className="receipt-grid">

                        <div className="receipt-field">

                            <span>
                                Student Name
                            </span>

                            <strong>
                                {studentName}
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Course
                            </span>

                            <strong>
                                {courseName}
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Email
                            </span>

                            <strong>
                                {studentEmail}
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {studentPhone}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* Payment Details */}

                <div className="receipt-section">

                    <h3>
                        Payment Details
                    </h3>

                    <div className="receipt-grid">

                        <div className="receipt-field">

                            <span>
                                Payment Date
                            </span>

                            <strong>
                                {payment.paymentDate
                                    ? new Date(
                                        payment.paymentDate
                                    ).toLocaleDateString()
                                    : "-"
                                }
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {payment.paymentMethod || "-"}
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Amount Paid
                            </span>

                            <strong className="receipt-amount">
                                ₹{payment.amount}
                            </strong>

                        </div>


                        <div className="receipt-field">

                            <span>
                                Payment Status
                            </span>

                            <strong className="receipt-status">
                                {paymentStatus}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* Fee Summary */}

                <div className="fee-summary">
                    <div className="fee-summary-box">
                        <span>
                            Total Fees
                        </span>
                        <strong>
                            ₹{payment.registrationId?.totalFees || 0}
                        </strong>
                    </div>
                    <div className="fee-summary-box">
                        <span>
                            Total Paid
                        </span>
                        <strong>
                            ₹{payment.registrationId?.paidFees || 0}
                        </strong>
                    </div>
                    <div className="fee-summary-box">
                        <span>
                            Remaining Fees
                        </span>
                        <strong>
                            ₹{payment.registrationId?.remainingFees || 0}
                        </strong>
                    </div>
                </div>

                {/* Remarks */}

                <div className="receipt-remarks">

                    <span>
                        Remarks
                    </span>

                    <strong>
                        {payment.remarks || "No remarks"}
                    </strong>

                </div>


                {/* Footer */}

                <div className="receipt-footer">

                    <p>
                        Thank you for your payment.
                    </p>

                    <span>
                        This is a computer-generated receipt.
                    </span>

                </div>


                {/* Buttons */}

                <div className="receipt-buttons">

                    <button
                        className="print-receipt-button"
                        onClick={() => window.print()}
                    >
                        🖨️ Print Receipt
                    </button>


                    <button
                        className="back-receipt-button"
                        onClick={() => setPage("fee-payment")}
                    >
                        ← Back to Payment History
                    </button>

                </div>

            </div>

        </div>

    );
}

export default FeeReceipt;