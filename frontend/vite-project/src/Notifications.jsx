import { useEffect, useState } from "react";
import axios from "axios";

function Notifications({ studentId }) {

    const [notifications, setNotifications] = useState([]);

        const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/notifications/${studentId}`
            );
            setNotifications(response.data);
        } catch (error) {
            console.log(
                "Notification fetch error:",
                error
            );
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(
                `http://localhost:5000/api/notifications/read/${id}`
            );
            fetchNotifications();
        } catch (error) {
            console.log(
                "Mark as read error:",
                error
            );
        }
    };


    useEffect(() => {
        if (studentId) {
            fetchNotifications();
        }

    }, [studentId]);


    return (

        <div className="notification-page">
            <div className="notification-container">

                <h1>
                    Notifications
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount}
                        </span>
                    )}
                </h1>

                {notifications.length === 0 ? (
                    <p>No notifications available.</p>
                ) : (

                    notifications.map((notification) => (
                        <div
                            className="notification-card"
                            key={notification._id}
                        >
                            <h3>
                                {notification.title}
                            </h3>
                            <p>
                                {notification.message}
                            </p>
                            {notification.document && (
                                <div className="notification-document">
                                    <a
                                        href={`http://localhost:5000/api/courses/document/${notification.document}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Document
                                    </a>
                                    <a
                                        href={`http://localhost:5000/uploads/${notification.document}`}
                                        download
                                    >
                                        Download Document
                                    </a>
                                </div>

                            )}

                            <small>
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}
                            </small>

                            {!notification.isRead && (
                                <button
                                    className="read-button"
                                    onClick={() =>
                                        handleMarkAsRead(notification._id)
                                    }
                                >
                                    Mark as Read
                                </button>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;