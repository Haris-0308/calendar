import React, { useState } from 'react';
import { addMonths, setMonth, setYear } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaSun, FaMoon } from 'react-icons/fa';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function NavigationBar({ currentDate, setCurrentDate, theme, toggleTheme }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const years = [];
  for (let y = currentYear + 10; y >= currentYear - 10; y--) {
    years.push(y);
  }

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year) => {
    setCurrentDate(setYear(currentDate, year));
    setShowYearDropdown(false);
  };

  return (
    <nav aria-label="Calendar navigation" style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
      {['prev', 'today', 'next'].map((btn) => {
        let onClick, ariaLabel, content;
        if (btn === 'prev') {
          onClick = () => setCurrentDate(addMonths(currentDate, -1));
          ariaLabel = 'Previous month';
          content = (<><FaChevronLeft aria-hidden="true" /> Prev</>);
        } else if (btn === 'today') {
          onClick = () => setCurrentDate(new Date());
          ariaLabel = 'Today';
          content = (<><FaCalendarDay aria-hidden="true" /> Today</>);
        } else {
          onClick = () => setCurrentDate(addMonths(currentDate, 1));
          ariaLabel = 'Next month';
          content = (<>Next <FaChevronRight aria-hidden="true" /></>);
        }
        return (
          <button
            key={btn}
            onClick={onClick}
            aria-label={ariaLabel}
            style={{
              ...navBtnStyle,
              ...(hoveredBtn === btn ? navBtnHoverFocus : {})
            }}
            onMouseEnter={() => setHoveredBtn(btn)}
            onMouseLeave={() => setHoveredBtn(null)}
            onFocus={() => setHoveredBtn(btn)}
            onBlur={() => setHoveredBtn(null)}
          >
            {content}
          </button>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
        <div
          onClick={() => {
            setShowMonthDropdown(!showMonthDropdown);
            setShowYearDropdown(false);
          }}
          style={{ padding: '6px 12px', borderRadius: 6, backgroundColor: 'var(--button-background)', color: 'var(--button-color)', fontWeight: 'bold' }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowMonthDropdown(!showMonthDropdown);
              setShowYearDropdown(false);
            }
          }}
          aria-label="Select month"
        >
          {months[currentMonthIndex]}
        </div>
        <div
          onClick={() => {
            setShowYearDropdown(!showYearDropdown);
            setShowMonthDropdown(false);
          }}
          style={{ padding: '6px 12px', borderRadius: 6, backgroundColor: 'var(--button-background)', color: 'var(--button-color)', fontWeight: 'bold' }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowYearDropdown(!showYearDropdown);
              setShowMonthDropdown(false);
            }
          }}
          aria-label="Select year"
        >
          {currentYear}
        </div>
      </div>
      {showMonthDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 'auto',
            backgroundColor: 'var(--modal-background)',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 1000,
            width: 120,
            color: 'var(--text-color)',
            cursor: 'pointer'
          }}
          role="listbox"
          tabIndex={-1}
        >
          {months.map((month, index) => (
            <li
              key={month}
              onClick={() => handleMonthSelect(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMonthSelect(index);
                }
              }}
              role="option"
              aria-selected={index === currentMonthIndex}
              tabIndex={0}
              style={{
                padding: '6px 12px',
                backgroundColor: index === currentMonthIndex ? 'var(--primary-color)' : 'transparent',
                color: index === currentMonthIndex ? 'var(--button-color)' : 'var(--text-color)'
              }}
            >
              {month}
            </li>
          ))}
        </ul>
      )}
      {showYearDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 'auto',
            backgroundColor: 'var(--modal-background)',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 1000,
            width: 120,
            color: 'var(--text-color)',
            cursor: 'pointer'
          }}
          role="listbox"
          tabIndex={-1}
        >
          {years.map((year) => (
            <li
              key={year}
              onClick={() => handleYearSelect(year)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleYearSelect(year);
                }
              }}
              role="option"
              aria-selected={year === currentYear}
              tabIndex={0}
              style={{
                padding: '6px 12px',
                backgroundColor: year === currentYear ? 'var(--primary-color)' : 'transparent',
                color: year === currentYear ? 'var(--button-color)' : 'var(--text-color)'
              }}
            >
              {year}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark/light theme"
        style={{ marginLeft: 'auto', ...navBtnStyle }}
        onMouseEnter={() => setHoveredBtn('theme')}
        onMouseLeave={() => setHoveredBtn(null)}
        onFocus={() => setHoveredBtn('theme')}
        onBlur={() => setHoveredBtn(null)}
      >
        {theme === 'light' ? <><FaSun aria-hidden="true" /> Light</> : <><FaMoon aria-hidden="true" /> Dark</>}
      </button>
    </nav>
  );
}

const navBtnStyle = {
  padding: '6px 12px',
  backgroundColor: 'var(--button-background)',
  color: 'var(--button-color)',
  border: 'none',
  borderRadius: 6,
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  transition: 'background-color 0.3s',
  userSelect: 'none',
  outline: 'none'
};

const navBtnHoverFocus = {
  backgroundColor: 'var(--button-hover-background)',
  outline: 'none'
};
