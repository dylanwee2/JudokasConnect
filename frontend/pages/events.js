import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { publicFetch } from '../utils/apis';
import EventModal from '../components/addEventModal';
import EditEventModal from '../components/editEventModal';
import EventAttendanceModal from '../components/eventAttendance';
import EventAdminModal from '../components/eventAdminModal';

import { auth } from "../pages/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";
 
export default function EventsPage() {
  // Init Calendar 
  const calendarRef = useRef(null);

  // Load User Account Details
  const [user, loading] = useAuthState(auth);

  // Set Event function
  const [events, setEvents] = useState([]);

  // Set Current User ID Function
  const [currentUserId, setUserId] = useState(null);

  // Open modals
  const [addEventsModal, setAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAdminModalOpen, setEventAdminModal] = useState(false); 
  const [attendanceModalOpen, setOpenAttendanceModal] = useState(false);
  const [editEventsModal, setEditEventsModal] = useState(false); 


  const router = useRouter();

  // Load Events 
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

  // Add new event
  const handleAddEvent = async (newEvent) => {
    try {
        const response = await publicFetch.post(`/api/events/add_event`, newEvent);
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
        await publicFetch.put(`/api/events/update_event/${selectedEvent.id}`, selectedEvent);
        
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

  // Update attendance
  const updateAttendance = async (pollResponse) => {
      const eventId = selectedEvent.id;

      try {
        const response = await publicFetch.get(`/api/events/get_event_attendance/${eventId}`);
        console.log("Before: ", response);

        // Get current lists
        let newAttendingList = [...(response.attendingList || [])];
        let newNotAttendingList = [...(response.NotAttendingList || [])];

        // Remove userId from both lists to avoid duplicates
        newAttendingList = newAttendingList.filter(id => id !== pollResponse.username);
        newNotAttendingList = newNotAttendingList.filter(id => id !== pollResponse.username);

        if(pollResponse.status == "attending"){
          newAttendingList.push(pollResponse.username);
        }
        else{
          newNotAttendingList.push(pollResponse.username);
        }
        response.attendingList = newAttendingList;
        response.NotAttendingList = newNotAttendingList;
        console.log("After: ", response);
        
        try {
          await publicFetch.put(`/api/events/update_event_attendance/${selectedEvent.id}`, response);
        } 
        catch (error) {
          console.error("Error updating attendance:", error.message);
          alert("Failed to update attendance.");
        }
      } 
      catch (error) {
          const attendanceData = {
          id: selectedEvent.id,
          title: selectedEvent.title,
          start: selectedEvent.start,
          allDay: selectedEvent.allDay,
          end: selectedEvent.end,
          attendingList: [],
          NotAttendingList: []
        };

        if(pollResponse.status == "attending"){
          attendanceData.attendingList.push(pollResponse.username);
        }
        else{
          attendanceData.NotAttendingList.push(pollResponse.username);
        }

        try {
          const response = await publicFetch.post(`/api/events/add_event_attendance`, attendanceData);
        } 
        catch (error) {
          console.error("Error adding attendance:", error.message);
          alert("Failed to add attendance.");
        }
      }
  };

  // 1️⃣ Load events from FastAPI
  useEffect(() => {
    if (loading) return; // wait until loading is done

    if (!user) {
      console.log("User is not logged in");
      alert("Please login to view training sessions");
      router.push('/');
    } else {
      console.log("User:", user);
      setUserId(user.uid);
      loadEvents();
    }
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
          const fetchEventData = async () => {
            try {
              const response = await publicFetch.get(`/api/events/get_event/${uid}`);
              const eventData = response;
              
              const eventUserId = eventData.userId;

              if (currentUserId !== eventUserId) {
                setSelectedEvent(eventData);
                setOpenAttendanceModal(true);
              }
              else{
                // Open modal with event data
                setSelectedEvent(eventData);
                setEventAdminModal(true);
              }
            } 
            catch (err) {
              console.error("Error events data:", err.message);
              alert("Failed to load event data.");
            }
          };
          fetchEventData();
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

      <EventAdminModal
        isOpen={eventAdminModalOpen}
        onClose={() => setEventAdminModal(false)}
        event={selectedEvent}
        setEvent={setSelectedEvent}
        onSave={(action, event) => {
          if (action === "open_attendance") {
            setOpenAttendanceModal(true);
          }
          if (action === "edit_event") {
            setEditEventsModal(true);
          }
        }}
      />

      <EditEventModal
        isOpen={editEventsModal}
        onClose={() => setEditEventsModal(false)}
        event={selectedEvent}
        setEvent={setSelectedEvent}
        onSave={async () => {
          try {
            await publicFetch.put(`/api/events/update_event/${selectedEvent.id}`, selectedEvent);
            setEditEventsModal(false);
            await loadEvents(); // Refresh calendar
          } catch (err) {
            console.error("Error saving event:", err.message);
            alert("Failed to update event.");
          }
        }}
      />

      <EventAttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setOpenAttendanceModal(false)}
        event={selectedEvent}
        onSubmit={updateAttendance}
      />
    </div>    
  );
}