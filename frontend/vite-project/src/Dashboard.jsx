import { useEffect, useState } from "react";
import axios from "axios";
import Student from "./Student";
import Attendance from "./Attendance";

function Dashboard({ logout }) {

    const [page, setPage] = useState("dashboard");

    const [totalStudents, setTotalStudents] = useState(0);
    const [presentToday, setPresentToday] = useState(0);
    const [absentToday, setAbsentToday] = useState(0);

    useEffect(() => {
    getStudentCount();
    getTodayAttendance();
    }, [page]);
       
    const getStudentCount = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/students"
            );
            setTotalStudents(response.data.length);
        } catch (error) {
            console.log("Student count error:", error);
        }
    };

    const getTodayAttendance = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/attendance/today"
            );
            setPresentToday(response.data.present);
            setAbsentToday(response.data.absent);
        } catch (error) {
            console.log("Today attendance error:", error);
        }
    };

    if (page === "add") {
        return <Student page="add" setPage={setPage} />;
    }

    if (page === "students") {
        return <Student page="students" setPage={setPage} />;
    }

    if (page === "attendance") {
        return <Attendance setPage={setPage} />;
    }

    return (
        <div className="dashboard-container">

            <div className="dashboard-card">

                <h1>Student Dashboard</h1>

                <p>Manage your students from here</p>

                <div className="dashboard-stats">
                    <div className="dashboard-count">
                        <h2>{totalStudents}</h2>
                        <span>Total Students</span>
                    </div>
                    <div className="dashboard-count present-count">
                        <h2>{presentToday}</h2>
                        <span>Present Today</span>
                    </div>
                    <div className="dashboard-count absent-count">
                        <h2>{absentToday}</h2>
                        <span>Absent Today</span>
                    </div>
                </div>

                <div className="dashboard-buttons">

                    <button
                        className="dashboard-button add-student"
                        onClick={() => setPage("add")} >
                        <span className="button-icon">+</span>
                        <strong>Add Student</strong>
                        <small>Add a new student</small>
                    </button>

                    <button
                        className="dashboard-button view-student"
                        onClick={() => setPage("students")} >
                        <span className="button-icon">👥</span>
                        <strong>View Students</strong>
                        <small>View all students</small>
                    </button>

                    <button
                        className="dashboard-button attendance-button"
                        onClick={() => setPage("attendance")} >
                        <span className="button-icon">📋</span>
                        <strong>Mark Attendance</strong>
                        <small>Mark student attendance</small>
                    </button>

                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
export default Dashboard;