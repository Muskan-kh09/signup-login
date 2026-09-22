import { useState } from "react";
import axios from "axios";

function Student() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [course, setCourse] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState("");

    const handleStudent = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:5000/api/students",
                {
                    name: name,
                    email: email,
                    phone: phone,
                    course: course,
                    city: city,
                    image: image
                }
            );

            alert(response.data.message);

            setName("");
            setEmail("");
            setPhone("");
            setCourse("");
            setCity("");
            setImage("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Student add failed"
            );

        }
    };

    return (
        <div className="student-container">

            <div className="student-card">

                <h1>Add Student</h1>

                <p>
                    Enter student details below
                </p>

                <form onSubmit={handleStudent}>

                    <div className="input-group">
                        <label>Student Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter student name"
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter student email"
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone</label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="input-group">
                        <label>Course</label>

                        <input
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            placeholder="Enter course"
                        />
                    </div>

                    <div className="input-group">
                        <label>City</label>

                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="input-group">
                        <label>Image URL</label>

                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Enter image URL"
                        />
                    </div>

                    <button
                        type="submit"
                        className="main-button"
                    >
                        Add Student
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Student;