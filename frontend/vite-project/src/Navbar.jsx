function Navbar({ page, setPage, logout, unreadNotifications }) {

    return (
        <header className="top-navbar">
            <div className="navbar-brand">
                🎓 Student Portal
            </div>
            <nav className="navbar-links">
                <button
                    className={page === "dashboard" ? "active-nav" : ""}
                    onClick={() => setPage("dashboard")} >
                    Dashboard
                </button>
                <button
                    className={page === "add" ? "active-nav" : ""}
                    onClick={() => setPage("add")} >
                    Add Student
                </button>
                <button
                    className={page === "students" ? "active-nav" : ""}
                    onClick={() => setPage("students")} >
                    Students
                </button>
                <button
                    className={page === "attendance" ? "active-nav" : ""}
                    onClick={() => setPage("attendance")} >
                    Attendance
                </button>
                <button
                    className={page === "course" ? "active-nav" : ""}
                    onClick={() => setPage("course")} >
                    Courses
                </button>
                <button
                    className={page === "registration" ? "active-nav" : ""}
                    onClick={() => setPage("registration")} >
                    Registration
                </button>
                <button
                    className={page === "fee-payment" ? "active-nav" : ""}
                    onClick={() => setPage("fee-payment")} >
                    Fee Payment
                </button>
                <button
                    className={page === "certificate" ? "active-nav" : ""}
                    onClick={() => setPage("certificate")} >
                    Certificates
                </button>
                <button
                    className={page === "my-certificates" ? "active-nav" : ""}
                    onClick={() => setPage("my-certificates")} >
                    My Certificates
                </button>
                <button
                    className={page === "notifications" ? "active-nav" : ""}
                    onClick={() => setPage("notifications")} >
                    🔔 Notifications
                    {unreadNotifications > 0 && (
                        <span className="notification-badge">
                            {unreadNotifications}
                        </span>
                    )}
                </button>
            </nav>
            <button
                type="button"
                className="navbar-logout"
                onClick={logout} >
                Logout
            </button>
        </header>
    );
}

export default Navbar;