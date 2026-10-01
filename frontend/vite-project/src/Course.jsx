import { useEffect, useState } from "react";
import axios from "axios";

function Course() {

    const [courses, setCourses] = useState([]);

    const [courseName, setCourseName] = useState("");
    const [duration, setDuration] = useState("");
    const [totalFees, setTotalFees] = useState("");
    const [registrationFee, setRegistrationFee] = useState("");
    const [description, setDescription] = useState("");

    const [editCourse, setEditCourse] = useState(null);


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


    useEffect(() => {
        fetchCourses();
    }, []);


    // Add course

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
                    {
                        courseName: courseName.trim(),
                        duration: duration.trim(),
                        totalFees: Number(totalFees),
                        registrationFee: Number(registrationFee),
                        description: description.trim()
                    }
                );
                alert("Course added successfully");
            }
            clearForm();
            fetchCourses();
        } catch (error) {
            console.log("Course save error:", error);
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

            console.log("Delete course error:", error);

            alert("Unable to delete course");

        }

    };


    // Clear form
    const clearForm = () => {

        setCourseName("");
        setDuration("");
        setTotalFees("");
        setRegistrationFee("");
        setDescription("");

        setEditCourse(null);

    };


    return (

        <div className="course-page">

            <div className="course-container">

                <h1>
                    {editCourse ? "Edit Course" : "Add Course"}
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
                                    <strong>Duration:</strong>{" "}
                                    {course.duration}
                                </p>

                                <p>
                                    <strong>Total Fees:</strong>{" "}
                                    ₹{course.totalFees}
                                </p>

                                <p>
                                    <strong>Registration Fee:</strong>{" "}
                                    ₹{course.registrationFee}
                                </p>

                                <p>
                                    <strong>Description:</strong>{" "}
                                    {course.description}
                                </p>


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
                                            handleDelete(course._id)
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

        </div>

    );

}

export default Course;