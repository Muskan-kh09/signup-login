import { useEffect, useState } from "react";
import axios from "axios";

function Registration({ setPage }) {

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [registrationDate, setRegistrationDate] = useState("");
    const [registrationFee, setRegistrationFee] = useState("");

    const [totalFees, setTotalFees] = useState(0);
    const [remainingFees, setRemainingFees] = useState(0);


    // Get students, courses and registrations
    useEffect(() => {

        fetchStudents();
        fetchCourses();
        fetchRegistrations();

    }, []);


    // Get students
    const fetchStudents = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/students"
            );

            setStudents(response.data);

        } catch (error) {

            console.log("Student fetch error:", error);

        }

    };


    // Get courses
    const fetchCourses = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/courses"
            );

            setCourses(response.data);

        } catch (error) {

            console.log("Course fetch error:", error);

        }

    };


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


    // Course select
    const handleCourseChange = (e) => {

        const selectedCourseId = e.target.value;

        setCourseId(selectedCourseId);

        const selectedCourse = courses.find(
            (course) => course._id === selectedCourseId
        );


        if (selectedCourse) {

            setTotalFees(selectedCourse.totalFees);

            setRegistrationFee(
                selectedCourse.registrationFee
            );

            setRemainingFees(
                selectedCourse.totalFees -
                selectedCourse.registrationFee
            );

        } else {

            setTotalFees(0);
            setRegistrationFee("");
            setRemainingFees(0);

        }

    };


    // Registration fee change
    const handleRegistrationFeeChange = (e) => {

        const fee = e.target.value;

        setRegistrationFee(fee);

        if (fee === "") {

            setRemainingFees(totalFees);

            return;

        }

        setRemainingFees(
            Number(totalFees) - Number(fee)
        );

    };


    // Submit registration
    const handleSubmit = async (e) => {

        e.preventDefault();


        if (studentId === "") {

            alert("Please select student");
            return;

        }


        if (courseId === "") {

            alert("Please select course");
            return;

        }


        if (registrationDate === "") {

            alert("Please select registration date");
            return;

        }


        if (
            registrationFee === "" ||
            Number(registrationFee) < 0
        ) {

            alert("Registration fee cannot be negative");
            return;

        }


        if (Number(registrationFee) > Number(totalFees)) {

            alert(
                "Registration fee cannot be greater than total fees"
            );

            return;

        }


        try {

            await axios.post(
                "http://localhost:5000/api/registrations",
                {
                    studentId: studentId,
                    courseId: courseId,
                    registrationDate: registrationDate,
                    registrationFee: Number(registrationFee)
                }
            );


            alert("Student registered successfully");


            // Clear form
            setStudentId("");
            setCourseId("");
            setRegistrationDate("");
            setRegistrationFee("");
            setTotalFees(0);
            setRemainingFees(0);


            // Refresh registration list
            fetchRegistrations();


        } catch (error) {

            console.log(
                "Registration save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        }

    };


    return (

        <div className="registration-page">

            <div className="registration-container">

                <h1>Student Registration</h1>

                <p>
                    Register a student for a training course
                </p>


                {/* Registration Form */}

                <form
                    className="registration-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Select Student</label>

                        <select
                            value={studentId}
                            onChange={(e) =>
                                setStudentId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.name} - {student.email}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>Select Course</label>

                        <select
                            value={courseId}
                            onChange={handleCourseChange}
                        >

                            <option value="">
                                Select Course
                            </option>

                            {courses.map((course) => (

                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.courseName}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>Registration Date</label>

                        <input
                            type="date"
                            value={registrationDate}
                            onChange={(e) =>
                                setRegistrationDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>Total Fees</label>

                        <input
                            type="number"
                            value={totalFees}
                            readOnly
                        />

                    </div>


                    <div className="form-group">

                        <label>Registration Fee</label>

                        <input
                            type="number"
                            value={registrationFee}
                            onChange={
                                handleRegistrationFeeChange
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>Remaining Fees</label>

                        <input
                            type="number"
                            value={remainingFees}
                            readOnly
                        />

                    </div>


                    <div className="registration-buttons">

                        <button type="submit">
                            Register Student
                        </button>

                        <button
                            type="button"
                            onClick={() => setPage("dashboard")}
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </form>


                {/* Registered Students */}

                <div className="registration-list">

                    <h2>Registered Students</h2>


                    {registrations.length === 0 ? (

                        <p>
                            No registered students found.
                        </p>

                    ) : (

                        <div className="registration-table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Date</th>
                                        <th>Total Fees</th>
                                        <th>Paid</th>
                                        <th>Remaining</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {registrations.map(
                                        (registration) => (
                                        <tr
                                            key={
                                                registration._id
                                            }
                                        >

                                            <td>
                                                {
                                                    registration
                                                        .studentId
                                                        ?.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    registration
                                                        .courseId
                                                        ?.courseName
                                                }
                                            </td>

                                            <td>
                                                {new Date(
                                                    registration
                                                        .registrationDate
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                ₹
                                                {
                                                    registration
                                                        .totalFees
                                                }
                                            </td>

                                            <td>
                                                ₹
                                                {
                                                    registration
                                                        .registrationFee
                                                }
                                            </td>

                                            <td>
                                                ₹
                                                {
                                                    registration
                                                        .remainingFees
                                                }
                                            </td>

                                            <td>
                                                {registration.status
                                                    ? registration.status
                                                    : registration.remainingFees === 0
                                                    ? "Paid"
                                                    : "Partial"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )}

                </div>


            </div>

        </div>

    );

}

export default Registration;