import router from 'express-promise-router';
import { getEvents, createEvent } from '../core/models';

const handleGeneralError = (err, res) => {
  console.log('Error in endpoint', err);
  res.sendStatus(400);
};

const routes = router();

routes.get('/v1/events', (req, res) => {
  getEvents()
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

export default routes;
