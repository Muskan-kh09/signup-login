import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Student from "./Student";
import Course from "./Course";
import FeePayment from "./FeePayment";
import FeeReceipt from "./FeeReceipt";
import Notifications from "./Notifications";
import "./App.css";

function App() {

    const [page, setPage] = useState(
        localStorage.getItem("isLoggedIn") === "true"
            ? "dashboard"
            : "signup"
    );

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPayment, setSelectedPayment] = useState(null);


    const handleSignup = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long");
            return;
        } 

        if (!email.endsWith("@gmail.com")) {
            setErrorMessage("Please enter a valid Gmail address");
            return;
        }

        if (name.trim() === "") {
            setErrorMessage("Please enter your full name");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/api/signup",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            alert(response.data.message);

            setName("");
            setEmail("");
            setPassword("");
            setShowPassword(false);

            setPage("login");

        } catch (error) {

            setErrorMessage(
                error.response?.data?.message ||
                "Signup failed"
            );

        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        setErrorMessage("");

         if (email.trim() === "") {
            setErrorMessage("Please enter your email address");
            return;
        }

        if (password.trim() === "") {
            setErrorMessage("Please enter your password");
            return; 
        }

        if (!email.endsWith("@gmail.com")) {
            setErrorMessage("Please enter a valid Gmail address");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    email: email,
                    password: password
                }
            );

            alert(response.data.message);

            setEmail("");
            setPassword("");
            setShowPassword(false);

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem(
                "notificationStudentId",
                response.data.user.studentId || ""
            );

setPage("dashboard");

        } catch (error) {

            setErrorMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };


    if (page === "dashboard") {
        return (
            <Dashboard
                setPage={setPage}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                logout={() => {
                    localStorage.removeItem("isLoggedIn");
                    setPage("login");
                }}
            />
        );
    }


    if (page === "course") {
        return (
            <Course />
        );
    }


    if (page === "student") {
        return (
            <Student
                page="students"
                setPage={setPage}
            />
        );
    }


    if (page === "fee-payment") {
        return (
            <FeePayment
                setPage={setPage}
                setSelectedPayment={setSelectedPayment}
            />
        );
    }


    if (page === "fee-receipt") {
        return (
            <FeeReceipt
                payment={selectedPayment}
                setPage={setPage}
            />
        );
    }

    if (page === "notifications") {
        return (
            <Notifications
                studentId={localStorage.getItem(
                    "notificationStudentId"
                )}
            />
        );
    }


    return (
        <div className="main-container">

            <div className="auth-card">
                <div className="auth-header">

                    <h1>
                        {page === "signup"
                            ? "Create Account"
                            : "Welcome Back"}
                    </h1>

                    <p>
                        {page === "signup"
                            ? "Create your account to get started"
                            : "Login to continue to your account"}
                    </p>

                </div>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                {page === "signup" ? (

                    <form onSubmit={handleSignup}>

                        <div className="input-group">

                            <label>Full Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrorMessage("");
                                }}
                                placeholder="Enter your full name"
                            />

                        </div>


                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                placeholder="Enter your email"
                            />

                        </div>


                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-box">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <button
                            className="main-button"
                            type="submit"
                        >
                            Create Account
                        </button>

                    </form>

                ) : (

                    <form onSubmit={handleLogin}>

                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                placeholder="Enter your email"
                            />

                        </div>


                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-box">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <button
                            className="main-button"
                            type="submit"
                        >
                            Login
                        </button>

                    </form>

                )}


                <div className="switch-page">

                    {page === "signup" ? (

                        <p>
                            Already have an account?

                            <button
                                onClick={() => setPage("login")}
                            >
                                Login
                            </button>
                        </p>

                    ) : (

                        <p>
                            Don't have an account?

                            <button
                                onClick={() => setPage("signup")}
                            >
                                Create Account
                            </button>
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}

export default App;