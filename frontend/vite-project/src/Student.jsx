import { useEffect, useState } from "react";
import axios from "axios";

function Student({ page, setPage }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [course, setCourse] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState("");
    const [document, setDocument] = useState("");
    const [students, setStudents] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 6;

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

        // PHONE VALIDATION

        if (phone.length < 10) {

            alert(
                "Your phone number is less than 10 digits. Please complete it."
            );

            return;
        }

        // EMAIL VALIDATION

        const emailPattern = /^[^\s@]+@gmail\.com$/;

        if (!emailPattern.test(email)) {

            alert(
                "Please enter a valid Gmail address like example@gmail.com"
            );

            return;
        }

        // DUPLICATE PHONE CHECK

        const phoneExists = students.some(
            (student) => student.phone === phone
        );

        if (phoneExists) {

            alert(
                "This phone number is already registered with another student."
            );

            return;
        }

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("course", course);
            formData.append("city", city);
            formData.append("image", image);

            if (document) {
                formData.append("document", document);
            }

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

            setPage("students");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Student add failed"
            );

        }

    };

    const handleEdit = (student) => {

        setEditStudent(student);
        setName(student.name);
        setEmail(student.email);
        setPhone(student.phone);
        setCourse(student.course);
        setCity(student.city);
        setImage("");

    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        // PHONE VALIDATION

        if (phone.length < 10) {

            alert(
                "Your phone number is less than 10 digits. Please complete it."
            );

            return;
        }

        // EMAIL VALIDATION

        const emailPattern = /^[^\s@]+@gmail\.com$/;

        if (!emailPattern.test(email)) {

            alert(
                "Please enter a valid Gmail address like example@gmail.com"
            );

            return;
        }

        // DUPLICATE PHONE CHECK
        // Current student ko ignore karega

        const phoneExists = students.some(
            (student) =>
                student.phone === phone &&
                student._id !== editStudent._id
        );

        if (phoneExists) {

            alert(
                "This phone number is already registered with another student."
            );

            return;
        }

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("course", course);
            formData.append("city", city);

            if (image) {
                formData.append("image", image);
            }

            const response = await axios.put(
                `http://localhost:5000/api/students/${editStudent._id}`,
                formData
            );

            alert(response.data.message);

            setEditStudent(null);
            setName("");
            setEmail("");
            setPhone("");
            setCourse("");
            setCity("");
            setImage("");

            getStudents();

        } catch (error) {

            console.log("Update error:", error);

            alert(
                error.response?.data?.message ||
                "Student update failed"
            );

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await axios.delete(
                `http://localhost:5000/api/students/${id}`
            );

            alert(response.data.message);

            getStudents();

        } catch (error) {

            console.log("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Student delete failed"
            );

        }

    };

    // SEARCH STUDENTS

    const filteredStudents = students.filter((student) => {

        return (
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.email.toLowerCase().includes(search.toLowerCase()) ||
            student.course.toLowerCase().includes(search.toLowerCase())
        );

    });

    // PAGINATION

    const indexOfLastStudent =
        currentPage * studentsPerPage;

    const indexOfFirstStudent =
        indexOfLastStudent - studentsPerPage;

    const currentStudents =
        filteredStudents.slice(
            indexOfFirstStudent,
            indexOfLastStudent
        );

    const totalPages =
        Math.ceil(
            filteredStudents.length / studentsPerPage
        );

    // STUDENT DETAILS

    if (selectedStudent) {

        return (
            <div className="student-container">

                <div className="student-card">

                    <button
                        className="back-button"
                        onClick={() => setSelectedStudent(null)}
                    >
                        ← Back
                    </button>

                    <h1>Student Details</h1>

                    <img
                        src={`http://localhost:5000/uploads/${selectedStudent.image}`}
                        alt={selectedStudent.name}
                    />

                    <h2>{selectedStudent.name}</h2>

                    <p>
                        <strong>Email:</strong> {selectedStudent.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {selectedStudent.phone}
                    </p>

                    <p>
                        <strong>Course:</strong> {selectedStudent.course}
                    </p>

                    <p>
                        <strong>City:</strong> {selectedStudent.city}
                    </p>
                    {selectedStudent.document && (
                        <div>
                            <strong>Document:</strong>
                            <br />
<button
    className="main-button"
    onClick={async () => {

        try {

            const response = await axios.get(
                `http://localhost:5000/api/students/document/${selectedStudent.document}`,
                {
                    responseType: "blob"
                }
            );

            const fileURL = window.URL.createObjectURL(
                response.data
            );

            window.open(fileURL, "_blank");

        } catch (error) {

            console.log("Document view error:", error);

            alert("Document open nahi ho raha");

        }

    }}
>
    View Document
</button>
                            <br />
                            <a
                                href={`http://localhost:5000/uploads/${selectedStudent.document}`}
                                download
                            >
                                Download Document
                            </a>
                        </div>
                    )}
                </div>

            </div>
        );

    }

    // ADD STUDENT PAGE

    if (page === "add" || editStudent) {

        return (
            <div className="student-container">

                <div className="student-card">

                    <button
                        className="back-button"
                        onClick={() => {

                            setEditStudent(null);
                            setName("");
                            setEmail("");
                            setPhone("");
                            setCourse("");
                            setCity("");
                            setImage("");
                            setPage("dashboard");

                        }}
                    >
                        ← Dashboard
                    </button>

                    <h1>
                        {editStudent
                            ? "Edit Student"
                            : "Add Student"}
                    </h1>

                    <p>
                        {editStudent
                            ? "Update student details below"
                            : "Enter student details below"}
                    </p>

                    <form
                        onSubmit={
                            editStudent
                                ? handleUpdate
                                : handleStudent
                        }
                    >

                        <div className="student-form-row">

                            <div className="input-group">

                                <label>Student Name</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter student name"
                                    required
                                />

                            </div>

                            <div className="input-group">

                                <label>Email</label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter Gmail address"
                                    required
                                />

                            </div>

                        </div>

                        <div className="student-form-row">

                            <div className="input-group">

                                <label>Phone</label>

                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value;

                                        if (
                                            /^\d*$/.test(value) &&
                                            value.length <= 10
                                        ) {
                                            setPhone(value);
                                        }

                                    }}
                                    placeholder="Enter 10 digit phone number"
                                    maxLength="10"
                                    required
                                />

                            </div>

                            <div className="input-group">

                                <label>Course</label>

                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) =>
                                        setCourse(e.target.value)
                                    }
                                    placeholder="Enter course"
                                    required
                                />

                            </div>

                        </div>

                        <div className="student-form-row">

                            <div className="input-group">

                                <label>City</label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                    placeholder="Enter city"
                                    required
                                />

                            </div>

                            <div className="input-group">
                                <label>Student Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(
                                            e.target.files[0]
                                        )
                                    }
                                    required={!editStudent}
                                />
                            </div>
                            <div className="input-group">
                                <label>Student Document</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                        setDocument(
                                            e.target.files[0]
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="main-button"
                        >
                            {editStudent
                                ? "Update Student"
                                : "Add Student"}
                        </button>

                    </form>

                </div>

            </div>
        );

    }

    // STUDENT LIST PAGE

    return (
        <div className="student-container">

            <div className="student-card">

                <button
                    className="back-button"
                    onClick={() => setPage("dashboard")}
                >
                    ← Dashboard
                </button>

                <h1>Student List</h1>

                <p>
                    View and manage all students
                </p>

                {/* SEARCH BOX */}

                <div className="student-search">

                    <input
                        type="text"
                        placeholder="Search by name, email or course..."
                        value={search}
                        onChange={(e) => {

                            setSearch(e.target.value);
                            setCurrentPage(1);

                        }}
                    />

                </div>

                <div className="student-list">

                    {currentStudents.length === 0 ? (

                        <p>
                            {search
                                ? "No students found for your search."
                                : "No students found."}
                        </p>

                    ) : (

                        currentStudents.map((student) => (

                            <div
                                className="student-box"
                                key={student._id}
                            >

                                <img
                                    src={`http://localhost:5000/uploads/${student.image}`}
                                    alt={student.name}
                                />

                                <h3>{student.name}</h3>

                                <p>
                                    Email: {student.email}
                                </p>

                                <p>
                                    Course: {student.course}
                                </p>

                                <div className="student-buttons">

                                    <button
                                        className="main-button"
                                        onClick={() =>
                                            setSelectedStudent(student)
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(student)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(student._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                {totalPages > 1 && (

                    <div className="pagination">

                        <button
                            onClick={() =>
                                setCurrentPage(
                                    currentPage - 1
                                )
                            }
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </button>

                        <span>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage(
                                    currentPage + 1
                                )
                            }
                            disabled={
                                currentPage === totalPages
                            }
                        >
                            Next →
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Student;