import { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { publicFetch } from '../utils/apis';

export default function EventAttendanceModal({ isOpen, onClose, onSubmit, event }) {
  const [status, setStatus] = useState(null); // "attending" or "not_attending"
  const [user, loading] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  // Attending list data setters
  const [attendingList, setAttendingList] = useState([]);
  const [notAttendingList, setNotAttendingList] = useState([]);


  const handleSubmit = async () => {
    if (!status) return alert("Please select your attendance status.");

    const pollResponse = {
      username,
      status,
    };

    onSubmit(pollResponse);
    setStatus(null);
    onClose();
  };

  const get_event_attendance_data= async () => {
    const eventId = event.id;

    try {
      const response = await publicFetch.get(`/api/events/get_event_attendance/${eventId}`);

      // Get current lists
      let attendingList = [...(response.attendingList || [])];
      let notAttendingList = [...(response.NotAttendingList || [])];  

      setAttendingList(attendingList);
      setNotAttendingList(notAttendingList);
    } 
    catch (error) {
      // Get current lists
      let attendingList = [...([])];
      let notAttendingList = [...([])];  

      setAttendingList(attendingList);
      setNotAttendingList(notAttendingList);

      console.error("No one has RSVP for this event yet:");
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log("User is not logged in");
    } 
    else {
      setUsername(user.displayName);
      
    }
    if (isOpen && event?.id) {
      get_event_attendance_data();
    }
  }, [user, loading, isOpen, event?.id]);

  if(!isOpen){
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Are you attending?</h2>

        {/* Attending List */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-green-700 mb-1">✅ Attending:</h3>
          {attendingList.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-800">
              {attendingList.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No one is attending yet.</p>
          )}
        </div>

        {/* Not Attending List */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-red-700 mb-1">❌ Not Attending:</h3>
          {notAttendingList.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-800">
              {notAttendingList.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No one has declined yet.</p>
          )}
        </div>

        {/* Buttons */}
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