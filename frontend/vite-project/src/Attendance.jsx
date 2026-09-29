import { useEffect, useState } from "react";
import axios from "axios";

function Attendance({ setPage }) {

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [summary, setSummary] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Present");

    const [editAttendance, setEditAttendance] = useState(null);


    useEffect(() => {

        getStudents();
        getAttendance();

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