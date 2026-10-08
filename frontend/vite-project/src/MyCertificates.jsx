import { useEffect, useState } from "react";
import axios from "axios";

function MyCertificates() {

    const [certificates, setCertificates] = useState([]);

    const studentId = localStorage.getItem(
        "notificationStudentId"
    );


    const fetchCertificates = async () => {

        if (!studentId) {
            return;
        }

        try {

            const response = await axios.get(
                `http://localhost:5000/api/certificates/student/${studentId}`
            );

            setCertificates(response.data);

        } catch (error) {

            console.log(
                "My certificates fetch error:",
                error
            );

        }

    };


    useEffect(() => {

        fetchCertificates();

    }, []);


    return (

        <div className="certificate-page">

            <div className="certificate-container">

                <h1>
                    My Certificates
                </h1>


                {certificates.length === 0 ? (

                    <p>
                        No certificates available.
                    </p>

                ) : (

                    <div className="certificate-list">

                        {certificates.map((item) => (

                            <div
                                className="certificate-card"
                                key={item._id}
                            >

                                <h3>
                                    Certificate:{" "}
                                    {item.certificateNumber}
                                </h3>


                                <p>
                                    <strong>
                                        Course:
                                    </strong>{" "}
                                    {item.courseId
                                        ? item.courseId.courseName
                                        : "N/A"}
                                </p>


                                <p>
                                    <strong>
                                        Issue Date:
                                    </strong>{" "}
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

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default MyCertificates;