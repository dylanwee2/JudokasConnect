import React from "react";

export default function EditEventModal({ isOpen, onClose, event, setEvent, onSave }) {
  if (!isOpen || !event) return null;

  const handleChange = (field, value) => {
    setEvent({ ...event, [field]: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Event</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Event Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={event.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Yoga Session"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Start Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={event.start}
            onChange={(e) => handleChange("start", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">End Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={event.end}
            onChange={(e) => handleChange("end", e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="font-medium">All Day:</label>
          <button
            onClick={() =>
              handleChange("allDay", !event.allDay)
            }
            className={`px-4 py-1 rounded ${
              event.allDay ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {event.allDay ? "Yes" : "No"}
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
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}