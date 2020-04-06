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

export const createRoll = (data: Partial<DiceEvent>) => {
  const sql = `
    INSERT INTO events (event_id, event_type, creator_id, timestamp, description, rolls)
    VALUES ($[event_id], $[event_type], $[creator_id], $[timestamp], $[description], CAST($[rolls] AS json))
    RETURNING *;
  `;
  const params = {
    ...data,
    rolls: JSON.stringify(data.rolls),
    timestamp: Date.now(),
    event_type: 'dice_event',
    event_id: ulid(Date.now()) // Provides us a "unique" ID for our event.
  };
  return db.one(sql, params);
};

// Get all events
export const getEvents = () => {
  return db.any('SELECT * FROM events');
};

export const createUser = ({ name, email }) => {
  const sql = `
    INSERT INTO users (user_id, user_name, user_email, creation_timestamp)
    VALUES ($[id], $[name], $[email], $[timestamp])
    RETURNING *;
  `;

  const params = {
    name,
    email,
    id: ulid(),
    timestamp: Date.now()
  };

  return db.one(sql, params);
};
