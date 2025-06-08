import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

function EventsPage() {
  return (
    <div>
      <h1>Events Page</h1>
      <p>Welcome to the events page!</p>

      <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
    />
    </div>
  );
}

export default EventsPage;