import { useEffect, useState } from "react";
import axios from "axios";

function Student() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [course, setCourse] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState("");

    const [students, setStudents] = useState([]);   

    useEffect(() => {

            getStudents();

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

    const handleStudent = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

                formData.append("name", name);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("course", course);
                formData.append("city", city);
                formData.append("image", image);

                const response = await axios.post(
                    "http://localhost:5000/api/students",
                    formData
            );

            alert(response.data.message);

            setName("");
            setEmail("");
            setPhone("");
            setCourse("");
            setCity("");
            setImage("");

            getStudents();

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
                            placeholder="Enter student name" />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter student email" />
                    </div>
                    <div className="input-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number" />
                    </div>
                    <div className="input-group">
                        <label>Course</label>
                        <input
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            placeholder="Enter course" />
                    </div>
                    <div className="input-group">
                        <label>City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city" />
                    </div>
                    <div className="input-group">
                        <label>Student Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="main-button">
                        Add Student
                    </button>
                </form>
                <div className="student-list">
                    <h2>Students List</h2>                
                    {students.map((student) => (
                        <div className="student-box" key={student._id}>
                            <img
                                src={`http://localhost:5000/uploads/${student.image}`}
                                alt={student.name}
                                width="150"
                                height="150"
                            />
                            <h3>{student.name}</h3>
                            <p>Email: {student.email}</p>
                            <p>Phone: {student.phone}</p>
                            <p>Course: {student.course}</p>
                            <p>City: {student.city}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Student;