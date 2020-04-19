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
    WITH inserted AS (
      INSERT INTO events (event_id, event_type, creator_id, timestamp, description, rolls)
      VALUES ($[event_id], $[event_type], $[creator_id], $[timestamp], $[description], CAST($[rolls] AS json))
      RETURNING *
    )
    SELECT inserted.*, u.accent_color, u.user_name as player_name
    FROM inserted
    INNER JOIN users u ON (u.user_id = inserted.creator_id)
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
  const sql = `
  SELECT ev.*, u.accent_color as accent_color, u.user_name as player_name
  FROM events ev
  INNER JOIN users u ON (ev.creator_id = u.user_id)
  ORDER BY ev.timestamp DESC
  `;
  return db.any(sql);
};

export const createUser = (name, email) => {
  const sql = `
    INSERT INTO users (user_id, user_name, user_email, timestamp)
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

export const setUserColor = (id, color) => {
  const sql = `
    UPDATE users
    SET accent_color = $[color]
    WHERE user_id = $[id]
    RETURNING *;
  `;
  const params = {
    id,
    color
  };
  return db.one(sql, params);
};

export const loginUser = (name, email) => {
  const sql = `
    SELECT * FROM users WHERE user_name = $[name] and user_email = $[email]
  `;

  const params = {
    name,
    email
  };
  return db.one(sql, params);
};

export const getUser = id => {
  return db.one(`SELECT * FROM users WHERE user_id = '${id}'`);
};

export const createCharacter = (data: Partial<Character>) => {
  const sql = `
    INSERT INTO characters (
      character_id,
      character_name,
      owner_id,
      armor_class,
      hit_points,
      attack_bonus,
      reflex,
      will,
      fortitude,
      initiative,
      level,
      class
    )
    VALUES (
      $[character_id],
      $[character_name],
      $[owner_id],
      $[armor_class],
      $[hit_points],
      $[attack_bonus],
      $[reflex],
      $[will],
      $[fortitude],
      $[initiative],
      $[level],
      $[class]
      )
    RETURNING *;
  `;

  const params = {
    ...data,
    character_name: data.character_name,
    character_id: ulid(),
    owner_id: data.owner_id
  };
  return db.one(sql, params);
};

export const getCharacters = roomId => {
  const sql = `
  SELECT c.*, u.accent_color as accent_color, u.user_name as player_name
  WHERE room_id = $[roomId]
  FROM characters c
  INNER JOIN users u ON (c.owner_id = u.user_id)
  `;
  return db.any(sql, { roomId });
};

export const createRoom = (owner_id, room_name) => {
  const sql = `
    INSERT INTO rooms (owner_id, room_name, room_id, timestamp)
    VALUES ($[owner_id], $[room_name], $[room_id], $[timestamp])
    RETURNING *
  `;
  const params = {
    owner_id,
    room_name,
    room_id: ulid(Date.now()),
    timestamp: Date.now()
  };
  return db.one(sql, params);
};

export const editCharacterAttribute = (id, key, value) => {
  const sql = `
    WITH updated AS (
      UPDATE characters
      SET ${key} = $[value]
      WHERE character_id = $[id]
      RETURNING *
    )
    SELECT updated.*, u.accent_color, u.user_name as player_name
    FROM updated
    INNER JOIN users u ON (u.user_id = updated.owner_id)
  `;

  const params = {
    id,
    value
  };

  return db.one(sql, params);
};

export const getUserRooms = user_id => {
  return db.any(`SELECT * FROM rooms WHERE owner_id = '${user_id}'`);
};
