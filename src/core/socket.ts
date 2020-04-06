export const socketMiddleware = (io: SocketIO.Server) => (req, res, next) => {
  if (!req.socketIO) {
    req['io'] = io;
  }
  next();
};
