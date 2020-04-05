import { Instance } from 'express-ws';
import { log } from '../middleware/logger';

export const socketMiddleware = (io: SocketIO.Server) => (req, res, next) => {
  if (!req.socketIO) {
    req['io'] = io;

    req.io.on('connection', socket => {
      socket.on('data', msg => {
        log(msg);
      });
    });
  }
  next();
};
