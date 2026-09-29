import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Student from "./Student";
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

    const handleSignup = async (e) => {
        e.preventDefault();

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

            setPage("login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Signup failed"
            );

        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

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

            localStorage.setItem("isLoggedIn", "true");

            setPage("dashboard");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };

    if (page === "dashboard") {
       return (
            <Dashboard
                logout={() => {
                    localStorage.removeItem("isLoggedIn");
                    setPage("login");
                }}
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
                {page === "signup" ? (
                    <form onSubmit={handleSignup}>
                        <div className="input-group">

                            <label>Full Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                            />

                        </div>

                        <div className="input-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                            />

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
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                            />

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