import { useState } from "react";
import Student from "./Student";

function Dashboard({ logout }) {

    const [page, setPage] = useState("dashboard");

    if (page === "add") {
        return <Student page="add" setPage={setPage} />;
    }

    if (page === "students") {
        return <Student page="students" setPage={setPage} />;
    }

    return (
        <div className="dashboard-container">

            <div className="dashboard-card">

                <h1>Student Dashboard</h1>

                <p>Manage your students from here</p>

                <div className="dashboard-buttons">

                    <button
                        className="main-button"
                        onClick={() => setPage("add")}
                    >
                        Add Student
                    </button>

                    <button
                        className="main-button"
                        onClick={() => setPage("students")}
                    >
                        View Students
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