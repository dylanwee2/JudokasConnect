import { useState, useEffect, useRef } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EventAdminModal({ isOpen, onClose, event, setEvent, onSave }) {
    const [status, setStatus] = useState(null);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
        if (!user) console.log("User not logged in");
    }, [user, loading]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!status) {
            alert("Please select an option (Edit or Check Attendance)");
            return;
        }

        onClose(); // close admin modal

        setTimeout(() => {
            if (status === "edit_event") {
                onSave && onSave("edit_event", event); // 🔁 open edit modal in parent
            } else if (status === "attendance") {
                onSave && onSave("open_attendance", event);
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Event Admin</h2>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setStatus("edit_event")}
                        className={`flex-1 px-4 py-2 rounded font-medium text-white ${
                            status === "edit_event" ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                        }`}
                    >
                        Edit Event
                    </button>

                    <button
                        onClick={() => setStatus("attendance")}
                        className={`flex-1 px-4 py-2 rounded font-medium text-white ${
                            status === "attendance" ? "bg-red-600" : "bg-red-400 hover:bg-red-500"
                        }`}
                    >
                        RSVP Attendance
                    </button>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go
                    </button>
                </div>
            </div>
        </div>
    );
}