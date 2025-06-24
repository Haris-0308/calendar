import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { loadEvents } from '../../utils/eventLoader';
import NavigationBar from '../NavigationBar';
import CustomEvent from './CustomEvent';

const locales = {}; // Add locales if needed
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarContainer() {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        return parsedEvents.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end),
          conflict: false
        }));
      } catch {
        const loadedEvents = loadEvents();
        return loadedEvents.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end),
          conflict: false
        }));
      }
    } else {
      const loadedEvents = loadEvents();
      return loadedEvents.map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
        conflict: false
      }));
    }
  });

  // Function to detect conflicts among events
  const detectConflicts = (events) => {
    const updatedEvents = events.map(ev => ({ ...ev, conflict: false }));
    for (let i = 0; i < updatedEvents.length; i++) {
      for (let j = i + 1; j < updatedEvents.length; j++) {
        const ev1 = updatedEvents[i];
        const ev2 = updatedEvents[j];
        if (
          (ev1.start < ev2.end) &&
          (ev1.end > ev2.start)
        ) {
          ev1.conflict = true;
          ev2.conflict = true;
        }
      }
    }
    return updatedEvents;
  };

  // Update events with conflict info whenever events change
  useEffect(() => {
    setEvents(prevEvents => detectConflicts(prevEvents));
  }, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null });

  // State to track notifications shown
  // const [notifications, setNotifications] = useState([]);

  // Removed localStorage persistence to keep events only in JS memory (React state)
  // useEffect(() => {
  //   localStorage.setItem('events', JSON.stringify(events));
  // }, [events]);

  // useEffect(() => {
  //   // Request notification permission on component mount
  //   if (Notification.permission !== 'granted') {
  //     Notification.requestPermission();
  //   }
  // }, []);

  // useEffect(() => {
  //   // Check for events starting today and show notification if not already shown
  //   const now = new Date();
  //   events.forEach(event => {
  //     if (
  //       isSameDay(event.start, now) &&
  //       !notifications.some(n => n.id === event.id)
  //     ) {
  //       if (Notification.permission === 'granted') {
  //         new Notification('Event Reminder', {
  //           body: event.title,
  //           tag: event.id
  //         });
  //       }
  //       setNotifications(prev => [...prev, { id: event.id }]);
  //     }
  //   });
  // }, [events, notifications]);

  const onEventDrop = ({ event, start, end }) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: '', start, end });
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEventChange = (e) => {
    setNewEvent({ ...newEvent, title: e.target.value });
  };

  const handleSaveEvent = () => {
    if (!newEvent.title) return;

    // Ensure event end date is same day as start date
    let adjustedEnd = newEvent.end;
    if (newEvent.start && newEvent.end) {
      if (newEvent.end.getDate() !== newEvent.start.getDate() ||
          newEvent.end.getMonth() !== newEvent.start.getMonth() ||
          newEvent.end.getFullYear() !== newEvent.start.getFullYear()) {
        adjustedEnd = new Date(newEvent.start);
        adjustedEnd.setHours(newEvent.end.getHours());
        adjustedEnd.setMinutes(newEvent.end.getMinutes());
      }
    }

    const eventToSave = { ...newEvent, end: adjustedEnd };

    if (selectedEvent) {
      setEvents(prev =>
        prev.map(ev => (ev.id === selectedEvent.id ? { ...ev, ...eventToSave } : ev))
      );
    } else {
      setEvents(prev => [
        ...prev,
        { ...eventToSave, id: Date.now() }
      ]);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEvent({ title: '', start: null, end: null });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
      setShowEventModal(false);
      setSelectedEvent(null);
      setNewEvent({ title: '', start: null, end: null });
    }
  };

  return (
    <div style={{ padding: 16, backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: '20px 0', backgroundColor: 'var(--calendar-background)', color: 'var(--calendar-day-text-color)' }}
        date={currentDate}
        onNavigate={setCurrentDate}
        onView={setCurrentView}
        view={currentView}
        onEventDrop={onEventDrop}
        draggableAccessor={() => true}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        components={{
          event: CustomEvent
        }}
      />
      {showEventModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-dialog-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--modal-overlay-background)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
            setNewEvent({ title: '', start: null, end: null });
          }}
        >
          <div
            style={{
              background: 'var(--modal-background)',
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              maxWidth: '90vw',
              color: 'var(--text-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="event-dialog-title" style={{ marginTop: 0, color: 'var(--text-color)' }}>
              {selectedEvent ? 'Edit Event' : 'Add Event'}
            </h3>
            <input
              type="text"
              value={newEvent.title}
              onChange={handleEventChange}
              placeholder="Event title"
              style={{ width: '100%', fontSize: 16, padding: 8, borderRadius: 4, border: '1px solid var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'var(--calendar-background)' }}
              aria-label="Event title"
            />
            <div style={{ marginTop: 12 }}>
              <label htmlFor="start-time" style={{ display: 'block', marginBottom: 4, color: 'var(--text-color)' }}>Start Time:</label>
              <input
                id="start-time"
                type="time"
                value={newEvent.start ? newEvent.start.toTimeString().slice(0,5) : ''}
                onChange={(e) => {
                  if (!newEvent.start) return;
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const updatedStart = new Date(newEvent.start);
                  updatedStart.setHours(hours, minutes);
                  setNewEvent({ ...newEvent, start: updatedStart });
                }}
                style={{ width: '100%', fontSize: 16, padding: 8, borderRadius: 4, border: '1px solid var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'var(--calendar-background)' }}
                aria-label="Start time"
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <label htmlFor="end-time" style={{ display: 'block', marginBottom: 4, color: 'var(--text-color)' }}>End Time:</label>
              <input
                id="end-time"
                type="time"
                value={newEvent.end ? newEvent.end.toTimeString().slice(0,5) : ''}
                onChange={(e) => {
                  if (!newEvent.end) return;
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const updatedEnd = new Date(newEvent.end);
                  updatedEnd.setHours(hours, minutes);
                  setNewEvent({ ...newEvent, end: updatedEnd });
                }}
                style={{ width: '100%', fontSize: 16, padding: 8, borderRadius: 4, border: '1px solid var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'var(--calendar-background)' }}
                aria-label="End time"
              />
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  style={{
                    padding: '6px 18px',
                    background: 'var(--delete-button-background, #d32f2f)',
                    color: 'var(--delete-button-color, #fff)',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                  setNewEvent({ title: '', start: null, end: null });
                }}
                style={{
                  padding: '6px 18px',
                  background: 'var(--cancel-button-background, #ccc)',
                  color: 'var(--cancel-button-color, #333)',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                style={{
                  padding: '6px 18px',
                  background: 'var(--primary-color)',
                  color: 'var(--button-color)',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
