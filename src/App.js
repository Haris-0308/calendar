import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import CalendarContainer from './components/Calendar/CalendarContainer';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <NavigationBar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <CalendarContainer />
    </div>
  );
}
