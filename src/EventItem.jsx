import React, { useState } from "react";

export default function EventItem({ event }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{
        background: event.color || "#e57373",
        color: "#fff",
        padding: "4px 6px",
        borderRadius: 6,
        fontSize: 12,
        margin: "2px 0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        transition: "box-shadow 0.2s"
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      aria-describedby={`tooltip-${event.id}`}
    >
      {event.title}
      {show && (
        <div
          id={`tooltip-${event.id}`}
          role="tooltip"
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            background: "#222",
            color: "#fff",
            padding: 8,
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            minWidth: 160,
            fontSize: 13,
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div><strong>{event.title}</strong></div>
          <div>{event.time} ({event.duration})</div>
        </div>
      )}
    </div>
  );
}
