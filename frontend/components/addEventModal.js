import { useState, useEffect, use } from "react";
import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


export default function EventModal({ isOpen, onClose, onSubmit}) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(true);

  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
    }
    else {
      setUserId(user.uid);
    }
  }, [user, loading]);


  const handleSubmit = () => {
    if (!title || !start) return alert("Please enter title and start date");

    const newEvent = {
      userId,
      title,
      start,
      end: end || start, // fallback if no end date
      allDay,
    };

    onSubmit(newEvent);
    setTitle("");
    setStart("");
    setEnd("");
    setAllDay(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Event</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Event Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Yoga Session"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="font-medium">All Day:</label>
          <button
            onClick={() => setAllDay(!allDay)}
            className={`px-4 py-1 rounded ${
              allDay ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {allDay ? "Yes" : "No"}
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#B8D2D8] px-4 py-2 rounded-md hover:bg-[#97BBC3]"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}