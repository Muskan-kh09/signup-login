import { useEffect, useState } from "react";
import axios from "axios";

import Student from "./Student";
import Attendance from "./Attendance";
import Course from "./Course";
import Registration from "./Registration";
import FeePayment from "./FeePayment";
import FeeReceipt from "./FeeReceipt";
import Notifications from "./Notifications";
import Certificate from "./Certificate";
import MyCertificates from "./MyCertificates";
import Navbar from "./Navbar";

function Dashboard({
    userRole,
    logout,
    selectedPayment,
    setSelectedPayment
}) {

    const [page, setPage] = useState("dashboard");

    const [totalStudents, setTotalStudents] = useState(0);
    const [presentToday, setPresentToday] = useState(0);
    const [absentToday, setAbsentToday] = useState(0);
    const [overallAttendance, setOverallAttendance] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);


    // Fetch dashboard data
    useEffect(() => {

        getStudentCount();
        getTodayAttendance();
        getOverallAttendance();
        getUnreadNotifications();

    }, [page]);


    // Get total students
    const getStudentCount = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/students"
            );

            setTotalStudents(response.data.length);

        } catch (error) {

            console.log(
                "Student count error:",
                error
            );

        }

    };


    // Get today's attendance
    const getTodayAttendance = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/attendance/today"
            );

            setPresentToday(response.data.present);
            setAbsentToday(response.data.absent);

        } catch (error) {

            console.log(
                "Today attendance error:",
                error
            );

        }

    };


    // Get overall attendance
    const getOverallAttendance = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/attendance/overall"
            );

            setOverallAttendance(
                response.data.percentage
            );

        } catch (error) {

            console.log(
                "Overall attendance error:",
                error
            );

        }

    };


    // Get unread notification count
    const getUnreadNotifications = async () => {

        const studentId = localStorage.getItem(
            "notificationStudentId"
        );

        if (!studentId) {

            setUnreadNotifications(0);
            return;

        }

        try {

            const response = await axios.get(
                `http://localhost:5000/api/notifications/${studentId}`
            );

            const unread = response.data.filter(
                (notification) => !notification.isRead
            ).length;

            setUnreadNotifications(unread);

        } catch (error) {

            console.log(
                "Unread notification error:",
                error
            );

        }

    };


    // Common Navbar for all pages
    const navbar = (
        <Navbar
            page={page}
            userRole={userRole}
            setPage={setPage}
            logout={logout}
            unreadNotifications={unreadNotifications}
        />
    );


    // Add Student page
    if (page === "add") {

        return (
            <>
                {navbar}

                <Student
                    page="add"
                    setPage={setPage}
                />
            </>
        );

    }


    // View Students page
    if (page === "students") {

        return (
            <>
                {navbar}

                <Student
                    page="students"
                    setPage={setPage}
                />
            </>
        );

    }


    // Attendance page
    if (page === "attendance") {

        return (
            <>
                {navbar}

                <Attendance
                    setPage={setPage}
                />
            </>
        );

    }


    // Course page
    if (page === "course") {

        return (
            <>
                {navbar}

                <Course
                    setPage={setPage}
                />
            </>
        );

    }


    // Registration page
    if (page === "registration") {

        return (
            <>
                {navbar}

                <Registration
                    setPage={setPage}
                />
            </>
        );

    }


    // Fee Payment page
    if (page === "fee-payment") {

        return (
            <>
                {navbar}

                <FeePayment
                    setPage={setPage}
                    setSelectedPayment={setSelectedPayment}
                />
            </>
        );

    }


    // Fee Receipt page
    if (page === "fee-receipt") {

        return (
            <>
                {navbar}

                <FeeReceipt
                    payment={selectedPayment}
                    setPage={setPage}
                />
            </>
        );

    }


    // Manage Certificates page
    if (page === "certificate") {

        return (
            <>
                {navbar}

                <Certificate
                    setPage={setPage}
                />
            </>
        );

    }


    // My Certificates page
    if (page === "my-certificates") {

        return (
            <>
                {navbar}

                <MyCertificates
                    setPage={setPage}
                />
            </>
        );

    }


    // Notifications page
    if (page === "notifications") {

        return (
            <>
                {navbar}

                <Notifications
                    studentId={localStorage.getItem(
                        "notificationStudentId"
                    )}
                    setPage={setPage}
                />
            </>
        );

    }

    // Student Dashboard
    if (userRole !== "admin") {
        return (
            <>
                {navbar}
                <div className="dashboard-container">
                    <div className="dashboard-card student-home-card">
                        <h1>
                            🎓 Student Dashboard
                        </h1>
                        <p>
                            Welcome to your Student Portal
                        </p>
                        <div className="student-dashboard-actions">
                            <button
                                className="dashboard-button notification-button"
                                onClick={() => setPage("notifications")}
                            >
                                <span className="button-icon">
                                    🔔
                                </span>
                                <strong>
                                    My Notifications
                                </strong>
                                <small>
                                    View course documents and updates
                                </small>
                                {unreadNotifications > 0 && (
                                    <span className="notification-badge">
                                        {unreadNotifications} Unread
                                    </span>
                                )}
                            </button>
                            <button
                                className="dashboard-button my-certificate-button"
                                onClick={() => setPage("my-certificates")}
                            >
                                <span className="button-icon">
                                    🏆
                                </span>
                                <strong>
                                    My Certificates
                                </strong>
                                <small>
                                    View and download your certificates
                                </small>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Main Dashboard
    return (

        <>

            {navbar}

            <div className="dashboard-container">

                <div className="dashboard-card">

                    <div className="dashboard-top">

                        <h1>Student Dashboard</h1>

                    </div>

                    <p>
                        Manage your students from here
                    </p>


                    {/* Dashboard Statistics */}

                    <div className="dashboard-stats">

                        <div className="dashboard-count">

                            <h2>
                                {totalStudents}
                            </h2>

                            <span>
                                Total Students
                            </span>

                        </div>


                        <div className="dashboard-count present-count">

                            <h2>
                                {presentToday}
                            </h2>

                            <span>
                                Present Today
                            </span>

                        </div>


                        <div className="dashboard-count absent-count">

                            <h2>
                                {absentToday}
                            </h2>

                            <span>
                                Absent Today
                            </span>

                        </div>


                        <div className="dashboard-count overall-count">

                            <h2>
                                {overallAttendance.toFixed(2)}%
                            </h2>

                            <span>
                                Overall Attendance
                            </span>

                        </div>

                    </div>


                    {/* Dashboard Navigation Cards */}

                    <div className="dashboard-buttons">

                        {/* Add Student */}

                        <button
                            className="dashboard-button add-student"
                            onClick={() => setPage("add")}
                        >

                            <span className="button-icon">
                                +
                            </span>

                            <strong>
                                Add Student
                            </strong>

                            <small>
                                Add a new student
                            </small>

                        </button>


                        {/* View Students */}

                        <button
                            className="dashboard-button view-student"
                            onClick={() => setPage("students")}
                        >

                            <span className="button-icon">
                                👥
                            </span>

                            <strong>
                                View Students
                            </strong>

                            <small>
                                View all students
                            </small>

                        </button>


                        {/* Attendance */}

                        <button
                            className="dashboard-button attendance-button"
                            onClick={() => setPage("attendance")}
                        >

                            <span className="button-icon">
                                📋
                            </span>

                            <strong>
                                Mark Attendance
                            </strong>

                            <small>
                                Mark student attendance
                            </small>

                        </button>


                        {/* Courses */}

                        <button
                            className="dashboard-button course-button"
                            onClick={() => setPage("course")}
                        >

                            <span className="button-icon">
                                📚
                            </span>

                            <strong>
                                Manage Courses
                            </strong>

                            <small>
                                Add and manage training courses
                            </small>

                        </button>


                        {/* Registration */}

                        <button
                            className="dashboard-button registration-button"
                            onClick={() => setPage("registration")}
                        >

                            <span className="button-icon">
                                📝
                            </span>

                            <strong>
                                Student Registration
                            </strong>

                            <small>
                                Register student for a course
                            </small>

                        </button>


                        {/* Fee Payment */}

                        <button
                            className="dashboard-button fee-payment-button"
                            onClick={() => setPage("fee-payment")}
                        >

                            <span className="button-icon">
                                💰
                            </span>

                            <strong>
                                Fee Payment
                            </strong>

                            <small>
                                Manage student fees and installments
                            </small>

                        </button>


                        {/* Manage Certificates */}

                        <button
                            className="dashboard-button certificate-button"
                            onClick={() => setPage("certificate")}
                        >

                            <span className="button-icon">
                                🎓
                            </span>

                            <strong>
                                Certificates
                            </strong>

                            <small>
                                Manage student certificates
                            </small>

                        </button>


                        {/* My Certificates */}

                        <button
                            className="dashboard-button my-certificate-button"
                            onClick={() => setPage("my-certificates")}
                        >

                            <span className="button-icon">
                                🏆
                            </span>

                            <strong>
                                My Certificates
                            </strong>

                            <small>
                                View student certificates
                            </small>

                        </button>


                        {/* Notifications */}

                        <button
                            className="dashboard-button notification-button"
                            onClick={() => setPage("notifications")}
                        >

                            <span className="button-icon">
                                🔔

                                {unreadNotifications > 0 && (

                                    <span className="notification-badge">
                                        {unreadNotifications}
                                    </span>

                                )}

                            </span>

                            <strong>
                                Notifications
                            </strong>

                            <small>
                                View student notifications
                            </small>

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Dashboard;