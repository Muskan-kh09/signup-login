import { useEffect, useState } from "react";
import axios from "axios";

function FeePayment({ setPage, setSelectedPayment }) {

    const [registrations, setRegistrations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [registrationId, setRegistrationId] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [remarks, setRemarks] = useState("");
    const [totalFees, setTotalFees] = useState(0);
    const [paidFees, setPaidFees] = useState(0);
    const [remainingFees, setRemainingFees] = useState(0);
    const [status, setStatus] = useState("");


    useEffect(() => {

        fetchRegistrations();
        fetchPayments();

    }, []);


    // Get registrations
    const fetchRegistrations = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/registrations"
            );

            setRegistrations(response.data);

        } catch (error) {

            console.log(
                "Registration fetch error:",
                error
            );

        }

    };


    // Get payments
    const fetchPayments = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/fee-payments"
            );

            setPayments(response.data);

        } catch (error) {

            console.log(
                "Payment fetch error:",
                error
            );

        }

    };


    // Registration change
    const handleRegistrationChange = (e) => {

        const selectedId = e.target.value;

        setRegistrationId(selectedId);

        const selectedRegistration =
            registrations.find(
                (registration) =>
                    registration._id === selectedId
            );


        if (selectedRegistration) {
            setTotalFees(
                selectedRegistration.totalFees
            );

            const paid =
                Number(selectedRegistration.totalFees) -
                Number(selectedRegistration.remainingFees);

            setPaidFees(paid);

            setRemainingFees(
                selectedRegistration.remainingFees
            );

            setStatus(
                selectedRegistration.status ||
                (
                    selectedRegistration.remainingFees === 0
                        ? "Paid"
                        : "Partial"
                )
            );

        } else {

            setTotalFees(0);
            setPaidFees(0);
            setRemainingFees(0);
            setStatus("");

        }

    };


    // Payment amount change
    const handleAmountChange = (e) => {

        const paymentAmount = e.target.value;

        setAmount(paymentAmount);


        if (paymentAmount === "") {

            setRemainingFees(
                totalFees - paidFees
            );

            return;

        }


        setRemainingFees(
            totalFees -
            paidFees -
            Number(paymentAmount)
        );

    };


    // Submit payment
    const handleSubmit = async (e) => {

        e.preventDefault();


        if (registrationId === "") {

            alert("Please select student registration");

            return;

        }


        if (paymentDate === "") {

            alert("Please select payment date");

            return;

        }


        if (
            amount === "" ||
            Number(amount) <= 0
        ) {

            alert(
                "Payment amount must be greater than 0"
            );

            return;

        }


        if (
            Number(amount) >
            Number(totalFees - paidFees)
        ) {

            alert(
                "Payment amount cannot be greater than remaining fees"
            );

            return;

        }


        try {

            await axios.post(
                "http://localhost:5000/api/fee-payments",
                {
                    registrationId:
                        registrationId,

                    paymentDate:
                        paymentDate,

                    amount:
                        Number(amount),

                    paymentMethod:
                        paymentMethod,

                    remarks:
                        remarks
                }
            );


            alert(
                "Fee payment added successfully"
            );


            setRegistrationId("");
            setPaymentDate("");
            setAmount("");
            setPaymentMethod("Cash");
            setRemarks("");

            setTotalFees(0);
            setPaidFees(0);
            setRemainingFees(0);


            await fetchRegistrations();
            await fetchPayments();

        } catch (error) {

            console.log(
                "Payment save error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Payment failed"
            );

        }

    };


    return (

        <div className="fee-payment-page">

            <div className="fee-payment-container">

                <h1>Fee Payment</h1>

                <p>
                    Manage student fee payments and installments
                </p>


                {/* Payment Form */}

                <form
                    className="fee-payment-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Select Student
                        </label>

                        <select
                            value={registrationId}
                            onChange={
                                handleRegistrationChange
                            }
                        >

                            <option value="">
                                Select Registered Student
                            </option>


                            {registrations.map(
                                (registration) => (

                                    <option
                                        key={
                                            registration._id
                                        }
                                        value={
                                            registration._id
                                        }
                                    >

                                        {
                                            registration
                                                .studentId
                                                ?.name
                                        }

                                        {" - "}

                                        {
                                            registration
                                                .courseId
                                                ?.courseName
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Payment Date
                        </label>

                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) =>
                                setPaymentDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="fee-summary">

                        <div>

                            <span>
                                Total Fees
                            </span>

                            <strong>
                                ₹{totalFees}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Paid Fees
                            </span>

                            <strong>
                                ₹{paidFees}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Remaining Fees
                            </span>

                            <strong>
                                ₹{remainingFees}
                            </strong>

                        </div>


                        <div className="payment-status-display">

                            <span>
                                Payment Status
                            </span>

                            <strong>
                                {status || "-"}
                            </strong>

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Payment Amount
                        </label>

                        <input
                            type="number"
                            value={amount}
                            onChange={
                                handleAmountChange
                            }
                            placeholder="Enter payment amount"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Payment Method
                        </label>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        >

                            <option value="Cash">
                                Cash
                            </option>

                            <option value="UPI">
                                UPI
                            </option>

                            <option value="Card">
                                Card
                            </option>

                            <option value="Bank Transfer">
                                Bank Transfer
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Remarks
                        </label>

                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(
                                    e.target.value
                                )
                            }
                            placeholder="Optional"
                        />

                    </div>


                    <div className="fee-payment-buttons">

                        <button type="submit">
                            Add Payment
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setPage("dashboard")
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </form>


                {/* Payment History */}

                <div className="payment-history">

                    <h2>
                        Payment History
                    </h2>


                    {payments.length === 0 ? (

                        <p>
                            No payments found.
                        </p>

                    ) : (

                        <div className="payment-table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Remarks</th>
                                        <th>Status</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {payments.map(
                                        (payment) => (

                                            <tr
                                                key={
                                                    payment._id
                                                }
                                            >

                                                <td>
                                                    {
                                                        payment
                                                            .registrationId
                                                            ?.studentId
                                                            ?.name
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        payment
                                                            .registrationId
                                                            ?.courseId
                                                            ?.courseName
                                                    }
                                                </td>


                                                <td>

                                                    {new Date(
                                                        payment.paymentDate
                                                    ).toLocaleDateString()}

                                                </td>


                                                <td>

                                                    ₹
                                                    {
                                                        payment.amount
                                                    }

                                                </td>


                                                <td>
                                                    {
                                                        payment.paymentMethod
                                                    }
                                                </td>


                                                <td>

                                                    {
                                                        payment.remarks ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        payment.registrationId?.status
                                                            ? payment.registrationId.status
                                                            : payment.registrationId?.remainingFees === 0
                                                            ? "Paid"
                                                            : "Partial"
                                                    }

                                                </td>


                                                <td>

                                                    <button
                                                        onClick={() => {

                                                            setSelectedPayment(
                                                                payment
                                                            );

                                                            setPage(
                                                                "fee-receipt"
                                                            );

                                                        }}
                                                    >
                                                        View / Print Receipt
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default FeePayment;