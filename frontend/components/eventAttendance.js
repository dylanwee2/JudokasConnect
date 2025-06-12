import { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EventAttendanceModal({ isOpen, onClose, onSubmit, eventId }) {
  const [status, setStatus] = useState(null); // "attending" or "not_attending"
  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log("User is not logged in");
    } else {
      setUserId(user.uid);
    }
  }, [user, loading]);

  const handleSubmit = () => {
    if (!status) return alert("Please select your attendance status.");

    const pollResponse = {
      userId,
      eventId,
      status,
    };

    onSubmit(pollResponse);
    setStatus(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Are you attending?</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setStatus("attending")}
            className={`flex-1 px-4 py-2 rounded font-medium text-white ${
              status === "attending" ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
            }`}
          >
            ✅ Attending
          </button>
          <button
            onClick={() => setStatus("not_attending")}
            className={`flex-1 px-4 py-2 rounded font-medium text-white ${
              status === "not_attending" ? "bg-red-600" : "bg-red-400 hover:bg-red-500"
            }`}
          >
            ❌ Not Attending
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}