import { db } from './pgp';
import { ulid } from 'ulid';

// Creates a new event
export const createEvent = (data: Partial<DiceEvent>) => {
  const sql = `
    INSERT INTO events (event_id, event_type, creator_id, timestamp, description${
      !!data['rolls'] ? ', rolls' : ''
    })
    VALUES ($[event_id], $[event_type], $[creator_id], $[timestamp], $[description] ${
      !!data.rolls ? ", '" + JSON.stringify(data.rolls) + "'" : ''
    })
    RETURNING *;
  `;
  const params = {
    ...data,
    timestamp: Date.now(),
    event_id: ulid(Date.now()) // Provides us a "unique" ID for our event.
  };
  return db.one(sql, params);
};

// Get all events
export const getEvents = () => {
  return db.any('SELECT * FROM events');
};
