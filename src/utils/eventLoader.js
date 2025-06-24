import eventsData from '../data/events.json';

export const loadEvents = () => {
  return eventsData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }));
};
