import { useEffect, useState } from "react";
import axios from "axios";

function Course() {

    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [courseName, setCourseName] = useState("");
    const [duration, setDuration] = useState("");
    const [totalFees, setTotalFees] = useState("");
    const [registrationFee, setRegistrationFee] = useState("");
    const [description, setDescription] = useState("");
    const [document, setDocument] = useState(null);

    const [editCourse, setEditCourse] = useState(null);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");


    // Get all courses
    const fetchCourses = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/courses"
            );

            setCourses(response.data);

        } catch (error) {

            console.log("Course fetch error:", error);

        }

    };


    // Get all students
    const fetchStudents = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/students"
            );

            setStudents(response.data);

        } catch (error) {

            console.log("Student fetch error:", error);

        }

    };


    useEffect(() => {

        fetchCourses();
        fetchStudents();

    }, []);


    // Add / Edit course
    const handleSubmit = async (e) => {

        e.preventDefault();


        // Course name validation
        if (courseName.trim() === "") {

            alert("Please enter course name");
            return;

        }


        // Duration validation
        if (duration.trim() === "") {

            alert("Please enter course duration");
            return;

        }


        // Total fees validation
        if (
            totalFees === "" ||
            Number(totalFees) <= 0
        ) {

            alert("Total fees must be greater than 0");
            return;

        }


        // Registration fee validation
        if (
            registrationFee === "" ||
            Number(registrationFee) < 0
        ) {

            alert("Registration fee cannot be negative");
            return;

        }


        // Registration fee cannot be greater than total fees
        if (
            Number(registrationFee) > Number(totalFees)
        ) {

            alert(
                "Registration fee cannot be greater than total fees"
            );

            return;

        }


        // Description validation
        if (description.trim() === "") {

            alert("Please enter course description");
            return;

        }


        const formData = new FormData();

        formData.append(
            "courseName",
            courseName.trim()
        );

        formData.append(
            "duration",
            duration.trim()
        );

        formData.append(
            "totalFees",
            Number(totalFees)
        );

        formData.append(
            "registrationFee",
            Number(registrationFee)
        );

        formData.append(
            "description",
            description.trim()
        );


        if (document) {

            formData.append(
                "document",
                document
            );

        }


        try {

            if (editCourse) {

                await axios.put(
                    `http://localhost:5000/api/courses/${editCourse._id}`,
                    {
                        courseName: courseName.trim(),
                        duration: duration.trim(),
                        totalFees: Number(totalFees),
                        registrationFee: Number(registrationFee),
                        description: description.trim()
                    }
                );

                alert("Course updated successfully");

            } else {

                await axios.post(
                    "http://localhost:5000/api/courses",
                    formData
                );

                alert("Course added successfully");

            }


            clearForm();
            fetchCourses();

        } catch (error) {

            console.log(
                "Course save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };


    // Edit course
    const handleEdit = (course) => {

        setEditCourse(course);

        setCourseName(course.courseName);
        setDuration(course.duration);
        setTotalFees(course.totalFees);
        setRegistrationFee(course.registrationFee);
        setDescription(course.description);

        setDocument(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // Delete course
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await axios.delete(
                `http://localhost:5000/api/courses/${id}`
            );

            alert("Course deleted successfully");

            fetchCourses();

        } catch (error) {

            console.log(
                "Delete course error:",
                error
            );

            alert("Unable to delete course");

        }

    };


    // Send course notification to student
    const handleSendNotification = async () => {

        if (!selectedStudent) {

            alert("Please select a student");
            return;

        }


        if (notificationTitle.trim() === "") {

            alert("Please enter notification title");
            return;

        }


        if (notificationMessage.trim() === "") {

            alert("Please enter notification message");
            return;

        }


        try {

            await axios.post(
                "http://localhost:5000/api/notifications",
                {
                    studentId: selectedStudent,
                    courseId: selectedCourse._id,
                    title: notificationTitle.trim(),
                    message: notificationMessage.trim(),
                    document: selectedCourse.document || ""
                }
            );


            alert("Notification sent successfully");
            localStorage.setItem(
                "notificationStudentId",
                selectedStudent
            );
            closeNotificationBox();

        } catch (error) {

            console.log(
                "Notification send error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to send notification"
            );

        }

    };


    // Close notification box
    const closeNotificationBox = () => {

        setSelectedCourse(null);
        setSelectedStudent("");
        setNotificationTitle("");
        setNotificationMessage("");

    };


    // Clear course form
    const clearForm = () => {

        setCourseName("");
        setDuration("");
        setTotalFees("");
        setRegistrationFee("");
        setDescription("");
        setDocument(null);

        setEditCourse(null);

    };


    return (

        <div className="course-page">

            <div className="course-container">

                <h1>
                    {editCourse
                        ? "Edit Course"
                        : "Add Course"}
                </h1>


                <form
                    className="course-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Course Name</label>

                        <input
                            type="text"
                            placeholder="Enter course name"
                            value={courseName}
                            onChange={(e) =>
                                setCourseName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Duration</label>

                        <input
                            type="text"
                            placeholder="Example: 6 Months"
                            value={duration}
                            onChange={(e) =>
                                setDuration(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Total Fees</label>

                        <input
                            type="number"
                            placeholder="Enter total fees"
                            value={totalFees}
                            onChange={(e) =>
                                setTotalFees(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Registration Fee</label>

                        <input
                            type="number"
                            placeholder="Enter registration fee"
                            value={registrationFee}
                            onChange={(e) =>
                                setRegistrationFee(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group full-width">

                        <label>Description</label>

                        <textarea
                            placeholder="Enter course description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        ></textarea>

                    </div>


                    <div className="form-group full-width">

                        <label>Course Document</label>

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


                    <div className="course-buttons">

                        <button type="submit">

                            {editCourse
                                ? "Update Course"
                                : "Add Course"}

                        </button>


                        {editCourse && (

                            <button
                                type="button"
                                onClick={clearForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>


                <h2>All Courses</h2>


                <div className="course-list">

                    {courses.length === 0 ? (

                        <p>No courses available.</p>

                    ) : (

                        courses.map((course) => (

                            <div
                                className="course-card"
                                key={course._id}
                            >

                                <h3>
                                    {course.courseName}
                                </h3>


                                <p>
                                    <strong>
                                        Duration:
                                    </strong>{" "}
                                    {course.duration}
                                </p>


                                <p>
                                    <strong>
                                        Total Fees:
                                    </strong>{" "}
                                    ₹{course.totalFees}
                                </p>


                                <p>
                                    <strong>
                                        Registration Fee:
                                    </strong>{" "}
                                    ₹{course.registrationFee}
                                </p>


                                <p>
                                    <strong>
                                        Description:
                                    </strong>{" "}
                                    {course.description}
                                </p>


                                {course.document && (

                                    <div className="course-document-buttons">

                                        <a
                                            href={`http://localhost:5000/api/courses/document/${course.document}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Document
                                        </a>


                                        <a
                                            href={`http://localhost:5000/uploads/${course.document}`}
                                            download
                                        >
                                            Download Document
                                        </a>

                                    </div>

                                )}


                                <button
                                    className="send-button"
                                    onClick={() => {

                                        setSelectedCourse(course);

                                        setNotificationTitle(
                                            `${course.courseName} Document`
                                        );

                                        setNotificationMessage(
                                            `Please find the document for ${course.courseName}.`
                                        );

                                    }}
                                >
                                    Send to Student
                                </button>


                                <div className="course-card-buttons">

                                    <button
                                        onClick={() =>
                                            handleEdit(course)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                course._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* Send Notification Popup */}

            {selectedCourse && (

                <div className="notification-overlay">

                    <div className="notification-modal">

                        <button
                            className="notification-close"
                            type="button"
                            onClick={closeNotificationBox}
                        >
                            ×
                        </button>


                        <h2>
                            Send Course to Student
                        </h2>


                        <p>
                            <strong>
                                Course:
                            </strong>{" "}
                            {selectedCourse.courseName}
                        </p>


                        <div className="form-group">

                            <label>
                                Select Student
                            </label>

                            <select
                                value={selectedStudent}
                                onChange={(e) =>
                                    setSelectedStudent(
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
                                Notification Title
                            </label>

                            <input
                                type="text"
                                value={notificationTitle}
                                onChange={(e) =>
                                    setNotificationTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter notification title"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Message
                            </label>

                            <textarea
                                value={notificationMessage}
                                onChange={(e) =>
                                    setNotificationMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter message"
                            ></textarea>

                        </div>


                        {selectedCourse.document && (

                            <p className="document-info">
                                📄 Course document will also be sent.
                            </p>

                        )}


                        <div className="course-buttons">

                            <button
                                type="button"
                                onClick={handleSendNotification}
                            >
                                Send Notification
                            </button>


                            <button
                                type="button"
                                onClick={closeNotificationBox}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Course;