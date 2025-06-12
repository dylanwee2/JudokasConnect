import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { publicFetch } from '../utils/apis';
import EventModal from '../components/addEventModal';
import EditEventModal from '../components/editEventModal';
import EventAttendanceModal from '../components/eventAttendance';

import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
 
export default function EventsPage() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [addEventsModal, setAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEventsModal, setEditEventsModal] = useState(false); 
  const [user, loading] = useAuthState(auth);
  const [currentUserId, setUserId] = useState(null);
  const [attendanceModalOpen, setOpenAttendanceModal] = useState(false);

  const attendees = ["Alice", "Bob", "Charlie"];
  const nonAttendees = ["David", "Eva"];

  const loadEvents = async () => {
      try {
        const response = await publicFetch.get(`/api/events`);
        const rawEvents = response?.data || [];
        const eventsArray = [];

        if (!Array.isArray(rawEvents)) {
          console.error("Expected an array of events but got:", rawEvents);
          return;
        }

        for (let i = 0; i < response.length; i++) {
          eventsArray.push({
            id : response[i].id,
            userId: user.uid,
            title: response[i].title,
            start: response[i].start,
            allDay: response[i].allDay,
            end: response[i].end
          });
        }

        setEvents(eventsArray);
      } 
      catch (err) {
        console.error("Error fetching events:", err.message);
        alert("Failed to load event data.");
      }
    };

  // 2️⃣ Add new event
  const handleAddEvent = async (newEvent) => {
    try {
        const response = await publicFetch.post(`/api/events`, newEvent);
        const api = calendarRef.current?.getApi();
        api.addEvent(response);
    } 
    catch (err) {
      console.error("Error adding events:", err.message);
      alert("Failed to add event data.");
    }
  };

  // Update Event 
  const handleSave = async () => {
    try {
      await publicFetch.put(`/api/events/${selectedEvent.id}`, selectedEvent);
      
      // Optionally update event in your calendar UI (e.g. FullCalendar)
      const calendarApi = calendarRef.current.getApi();
      const existingEvent = calendarApi.getEventById(selectedEvent.id);
      if (existingEvent) {
        existingEvent.setProp('title', selectedEvent.title);
        existingEvent.setStart(selectedEvent.start);
        existingEvent.setEnd(selectedEvent.end);
      }

      setEditEventsModal(false);

      // Update UI
      loadEvents();
    } 
    catch (err) {
      console.error("Error saving event:", err.message);
      alert("Failed to update event.");
    }
  };

  // 1️⃣ Load events from FastAPI
  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
    } else {
      console.log("User:", user);
      setUserId(user.uid);
    }
    loadEvents();
  }, [user, loading]);

  return (
    <div className="mx-20">
      <h1 className="text-3xl font-bold mt-5 mb-6">Training Sessions</h1>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          right: 'addEventButton today prev,next',
        }}
        customButtons={{
          addEventButton: {
            text: 'Add Event',
            click: () => setAddEventModal(true),
          },
        }}
        eventClick= {function(info) {
          const uid = info.event.id;
          const fetchProfile = async () => {
            try {
              const response = await publicFetch.get(`/api/events/${uid}`);
              const eventData = response;

              const eventUserId = eventData.userId;

              if (currentUserId !== eventUserId) {
                setOpenAttendanceModal(true);
              }
              else{
                // Open modal with event data
                setSelectedEvent(eventData);
                setEditEventsModal(true);
              }
            } 
            catch (err) {
              console.error("Error fetching profile:", err.message);
              alert("Failed to load profile data.");
            }
          };
          fetchProfile();
        }}
        events={events}
        editable
        selectable
        nowIndicator
      />

      <EventModal
        isOpen={addEventsModal}
        onClose={() => setAddEventModal(false)}
        onSubmit={handleAddEvent}
      />

      <EditEventModal
        isOpen={editEventsModal}
        onClose={() => setEditEventsModal(false)}
        event={selectedEvent}
        setEvent={setSelectedEvent}
        onSave={handleSave}
      />

      <EventAttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setOpenAttendanceModal(false)}
        attendees={attendees}
        nonAttendees={nonAttendees}
      />
    </div>    
  );
}