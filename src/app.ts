import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import loggerMiddleware, { log } from './middleware/logger';
import { serverPort } from './config';
import httpServer from 'http';
import socketClient from 'socket.io';
import { socketMiddleware } from './core/socket';

const app = express();
const http = httpServer.createServer(app);
const io = socketClient(http);

io.on('connection', socket => {
  console.log('A user has connected');
  socket.on('data', msg => {
    log(msg);
  });
});

const socketMW = socketMiddleware(io);

app.use(socketMW);
app.use(loggerMiddleware);
app.use(cors());

app.use(bodyParser.json());
app.use('/api', routes);

const port = serverPort;

const startServer = () =>
  new Promise(resolve => {
    http.listen(port, () => {
      console.log(`Server listening port ${port}`);
      resolve();
    });
  }).catch(err => {
    console.log(err);
    process.exit(1);
  });

startServer();
