import router from 'express-promise-router';
import {
  getEvents,
  createEvent,
  createRoll,
  getUser,
  createUser,
  setUserColor,
  createCharacter,
  getCharacters,
  loginUser,
  editCharacterAttribute,
  getUserRooms,
  createRoom,
  getRoom
} from '../core/models';
import { validateEmail } from '../core/validation';
import { ulid } from 'ulid';

const handleGeneralError = (err, res) => {
  console.log('Error in endpoint', err);
  res.sendStatus(500);
};

const routes = router();

routes.get('/', (req, res) => {
  res.send({ message: 'I am alive. No worries.' });
});

routes.get('/v1/events/:roomId', (req, res) => {
  getEvents(req.params.roomId)
    .then(results => res.send(results))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/events/create', (req, res) => {
  createEvent(req.body)
    .then(result => {
      (req as any).io.send(result);
      return result;
    })
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/create/roll', (req, res) => {
  createRoll(req.body)
    .then(result => {
      (req as any).io.send(result);
      return result;
    })
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

// User related routes
routes.post('/v1/user/create', (req, res) => {
  createUser(req.body.name, req.body.email)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/user', (req, res) => {
  getUser(req.body.id)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/user/login', (req, res) => {
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (/\s/.test(req.body.name)) {
    return res.status(400).send({ message: 'Name can not contain whitespace' });
  }
  loginUser(req.body.name, req.body.email)
    .then(result => {
      if (result) {
        return res.send(result);
      }
      return res.sendStatus(404);
    })
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/user/color', (req, res) => {
  setUserColor(req.body.user_id, req.body.color)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

// Character related routes

routes.post('/v1/characters/create', (req, res) => {
  createCharacter(req.body)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.get('/v1/characters/:roomId', (req, res) => {
  getCharacters(req.params.roomId)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.get('/v1/rooms', (req, res) => {
  getUserRooms(req.query.user_id)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.get('/v1/rooms/:roomId', (req, res) => {
  getRoom(req.params.roomId)
    .then(result => res.send(result[0]))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/rooms/create', (req, res) => {
  createRoom(req.body.owner_id, req.body.room_name)
    .then(result => res.send(result))
    .catch(err => handleGeneralError(err, res));
});

routes.post('/v1/characters/value/', (req, res) => {
  editCharacterAttribute(req.body.id, req.body.key, req.body.value)
    .then(result => {
      (req as any).io.send({
        event_type: 'character_event',
        event_id: ulid(),
        timestamp: Date.now(),
        data: result
      });
      return res.send(result);
    })
    .catch(err => handleGeneralError(err, res));
});

export default routes;
