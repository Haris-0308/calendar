import React from 'react';

export default function CustomEvent({ event }) {
  return (
    <div style={{
      background: event.conflict ? 'var(--conflict-color, #d32f2f)' : (event.color || 'var(--primary-color)'),
      color: 'var(--button-color)',
      padding: '2px 6px',
      borderRadius: 4,
      fontSize: '0.9em'
    }}>
      <b>{event.title}</b>
      <div style={{ fontSize: '0.8em' }}>
        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {' - '}
        {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
