import { useEffect, useState } from "react";
import axios from "axios";

function Certificate() {

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [certificateNumber, setCertificateNumber] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [certificate, setCertificate] = useState(null);
    const [certificates, setCertificates] = useState([]);


    // Get all students
    const fetchStudents = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/students"
            );

            setStudents(response.data);

        } catch (error) {

            console.log(
                "Student fetch error:",
                error
            );

        }

    };


    // Get all courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/courses"
            );
            setCourses(response.data);
        } catch (error) {
            console.log(
                "Course fetch error:",
                error
            );
        }
    };

    // Get all certificates
    const fetchCertificates = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/certificates"
            );
            setCertificates(response.data);
        } catch (error) {
            console.log(
                "Certificate fetch error:",
                error
            );
        }
    };


    useEffect(() => {

        fetchStudents();
        fetchCourses();
        fetchCertificates();

    }, []);


    // Add certificate
    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!studentId) {

            alert("Please select student");
            return;

        }


        if (!courseId) {

            alert("Please select course");
            return;

        }


        if (certificateNumber.trim() === "") {

            alert("Please enter certificate number");
            return;

        }


        if (!issueDate) {

            alert("Please select issue date");
            return;

        }


        if (!certificate) {

            alert("Please upload certificate");
            return;

        }


        const formData = new FormData();

        formData.append(
            "studentId",
            studentId
        );

        formData.append(
            "courseId",
            courseId
        );

        formData.append(
            "certificateNumber",
            certificateNumber.trim()
        );

        formData.append(
            "issueDate",
            issueDate
        );

        formData.append(
            "certificate",
            certificate
        );


        try {

            await axios.post(
                "http://localhost:5000/api/certificates",
                formData
            );

            alert(
                "Certificate added successfully"
            );

            fetchCertificates();

            setStudentId("");
            setCourseId("");
            setCertificateNumber("");
            setIssueDate("");
            setCertificate(null);


        } catch (error) {

            console.log(
                "Certificate save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to add certificate"
            );

        }

    };


    return (

        <div className="certificate-page">

            <div className="certificate-container">

                <h1>
                    Add Certificate
                </h1>


                <form
                    className="certificate-form"
                    onSubmit={handleSubmit}
                    >
                    <div className="form-group">
                        <label>
                            Select Student
                        </label>
                        <select
                            value={studentId}
                            onChange={(e) =>
                                setStudentId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Student
                            </option>
                            {students.map((student) => (
                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.name} -{" "}
                                    {student.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            Select Course
                        </label>
                        <select
                            value={courseId}
                            onChange={(e) =>
                                setCourseId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Course
                            </option>
                            {courses.map((course) => (
                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            Certificate Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter certificate number"
                            value={certificateNumber}
                            onChange={(e) =>
                                setCertificateNumber(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Issue Date
                        </label>
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) =>
                                setIssueDate(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Upload Certificate
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                setCertificate(
                                    e.target.files[0]
                                )
                            }
                        />
                    </div>
                    <button
                        type="submit"
                    >
                        Add Certificate
                    </button>
                </form>
                
                <h2>All Certificates</h2>
                <div className="certificate-list">
                    {certificates.length === 0 ? (
                        <p>No certificates available.</p>
                    ) : (
                        certificates.map((item) => (
                            <div
                                className="certificate-card"
                                key={item._id}
                            >
                                <h3>
                                    {item.certificateNumber}
                                </h3>
                                <p>
                                    <strong>Student:</strong>{" "}
                                    {item.studentId
                                        ? item.studentId.name
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {item.studentId
                                        ? item.studentId.email
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Course:</strong>{" "}
                                    {item.courseId
                                        ? item.courseId.courseName
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Issue Date:</strong>{" "}
                                    {new Date(
                                        item.issueDate
                                    ).toLocaleDateString()}
                                </p>
                                {item.certificate && (
                                    <div className="certificate-actions">
                                        <a
                                            href={`http://localhost:5000/uploads/${item.certificate}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Certificate
                                        </a>
                                        <a
                                            href={`http://localhost:5000/uploads/${item.certificate}`}
                                            download
                                        >
                                            Download Certificate
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Certificate;