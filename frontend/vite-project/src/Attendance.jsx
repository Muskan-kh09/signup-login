import { useEffect, useState } from "react";
import axios from "axios";

function Attendance({ setPage }) {

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [summary, setSummary] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [studentAttendance, setStudentAttendance] = useState(null);
    const [studentRecords, setStudentRecords] = useState([]);
    const [showStudentAttendance, setShowStudentAttendance] = useState(false);

    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Present");

    const [editAttendance, setEditAttendance] = useState(null);


    useEffect(() => {

        getStudents();
        getAttendance();
        getSummary();

    }, []);


    const getStudents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/students"
            );
            setStudents(response.data);
        } catch (error) {
            console.log("Get students error:", error);
        }
    };


    const getAttendance = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/attendance"
            );
            setAttendance(response.data);
        } catch (error) {
            console.log("Get attendance error:", error);
        }
    };


    const getSummary = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/attendance/summary"
            );
            setSummary(response.data);
        } catch (error) {
            console.log("Get summary error:", error);
        }
    };

    const getStudentAttendance = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/attendance/student/${id}`
            );
            setStudentAttendance(response.data);
            setStudentRecords(response.data.records);
            setShowStudentAttendance(true);
        } catch (error) {
            console.log("Student attendance error:", error);
        }
    };


    const handleAttendance = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/attendance",
                {
                    studentId: studentId,
                    date: date,
                    status: status
                }
            );

            alert(response.data.message);

            setStudentId("");
            setDate("");
            setStatus("Present");

            getAttendance();
            getSummary();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Attendance failed"
            );

        }

    };


    const handleEdit = (record) => {

        setEditAttendance(record);

        setStudentId(record.studentId?._id);
        setDate(record.date);
        setStatus(record.status);

    };


    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.put(
                `http://localhost:5000/api/attendance/${editAttendance._id}`,
                {
                    studentId: studentId,
                    date: date,
                    status: status
                }
            );

            alert(response.data.message);

            setEditAttendance(null);
            setStudentId("");
            setDate("");
            setStatus("Present");

            getAttendance();
            getSummary();

        } catch (error) {

            console.log("Update attendance error:", error);

            alert(
                error.response?.data?.message ||
                "Attendance update failed"
            );

        }

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this attendance?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await axios.delete(
                `http://localhost:5000/api/attendance/${id}`
            );

            alert(response.data.message);

            getAttendance();
            getSummary();

        } catch (error) {

            console.log("Delete attendance error:", error);

            alert(
                error.response?.data?.message ||
                "Attendance delete failed"
            );

        }

    };


    return (
        <div className="student-container">

            <div className="student-card">

                <button
                    className="back-button"
                    onClick={() => setPage("dashboard")}
                >
                    ← Dashboard
                </button>


                <h1>
                    {editAttendance
                        ? "Edit Attendance"
                        : "Mark Attendance"}
                </h1>

                <p>
                    {editAttendance
                        ? "Update attendance details"
                        : "Add attendance for students"}
                </p>


                <form
                    onSubmit={
                        editAttendance
                            ? handleUpdate
                            : handleAttendance
                    }
                >

                    <div className="input-group">

                        <label>Select Student</label>

                        <select
                            value={studentId}
                            onChange={(e) =>
                                setStudentId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="input-group">

                        <label>Date</label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label>Attendance Status</label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option value="Present">
                                Present
                            </option>

                            <option value="Absent">
                                Absent
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        className="main-button"
                    >
                        {editAttendance
                            ? "Update Attendance"
                            : "Mark Attendance"}
                    </button>

                </form>

                {/* STUDENT WISE ATTENDANCE */}

                <div className="attendance-section">

                    <h2>Student Wise Attendance</h2>

                    <div className="input-group">

                        <label>Select Student</label>

                        <select
                            value={selectedStudent}
                            onChange={(e) => {
                                setSelectedStudent(e.target.value);

                                if (e.target.value) {
                                    getStudentAttendance(e.target.value);
                                } else {
                                    setStudentAttendance(null);
                                    setStudentRecords([]);
                                    setShowStudentAttendance(false);
                                }
                            }}
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {showStudentAttendance && studentAttendance && (

                        <div className="student-attendance-result">

                            <h3>
                                {studentAttendance.student?.name}
                            </h3>

                            <div className="attendance-stats">

                                <div>
                                    <strong>
                                        {studentAttendance.total}
                                    </strong>

                                    <span>
                                        Total
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {studentAttendance.present}
                                    </strong>

                                    <span>
                                        Present
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {studentAttendance.absent}
                                    </strong>

                                    <span>
                                        Absent
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {studentAttendance.percentage.toFixed(2)}%
                                    </strong>

                                    <span>
                                        Percentage
                                    </span>
                                </div>

                            </div>


                            <h3>Attendance Records</h3>

                            {studentRecords.length === 0 ? (

                                <p>
                                    No attendance records found.
                                </p>

                            ) : (

                                <div className="attendance-table-container">

                                    <table className="attendance-table">

                                        <thead>

                                            <tr>

                                                <th>Date</th>

                                                <th>Status</th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {studentRecords.map((record) => (

                                                <tr key={record._id}>

                                                    <td>
                                                        {record.date}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                record.status === "Present"
                                                                    ? "present-status"
                                                                    : "absent-status"
                                                            }
                                                        >
                                                            {record.status}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* ATTENDANCE SUMMARY */}

                <div className="attendance-section">

                    <h2>Attendance Summary</h2>

                    {summary.length === 0 ? (

                        <p>
                            No attendance summary found.
                        </p>

                    ) : (

                        <div className="attendance-table-container">

                            <table className="attendance-table">

                                <thead>

                                    <tr>

                                        <th>Student</th>

                                        <th>Total</th>

                                        <th>Present</th>

                                        <th>Absent</th>

                                        <th>Percentage</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {summary.map((student) => (

                                        <tr key={student.studentId}>

                                            <td>
                                                {student.name}
                                            </td>

                                            <td>
                                                {student.total}
                                            </td>

                                            <td>
                                                {student.present}
                                            </td>

                                            <td>
                                                {student.absent}
                                            </td>

                                            <td>
                                                {student.percentage.toFixed(2)}%
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* ATTENDANCE RECORDS */}

                <div className="attendance-section">

                    <h2>Attendance Records</h2>

                    {attendance.length === 0 ? (

                        <p>
                            No attendance records found.
                        </p>

                    ) : (

                        <div className="attendance-table-container">

                            <table className="attendance-table">

                                <thead>

                                    <tr>

                                        <th>Student</th>

                                        <th>Date</th>

                                        <th>Status</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {attendance.map((record) => (

                                        <tr key={record._id}>

                                            <td>
                                                {record.studentId?.name}
                                            </td>

                                            <td>
                                                {record.date}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        record.status === "Present"
                                                            ? "present-status"
                                                            : "absent-status"
                                                    }
                                                >
                                                    {record.status}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="attendance-buttons">

                                                    <button
                                                        className="attendance-edit-button"
                                                        onClick={() =>
                                                            handleEdit(record)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="attendance-delete-button"
                                                        onClick={() =>
                                                            handleDelete(record._id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

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

export default Attendance;