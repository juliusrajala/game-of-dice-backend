import { format } from 'date-fns';

const loggerMiddleware = (req: Request, res, next) => {
  console.log(
    `[${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}]: ${req.method} - ${req.url}`
  );
  next();
};

export const log = (msg: string) => {
  console.log(`[${format(new Date(), 'dd.MM.yyyy HH:mm:ss')}]: ${msg}`);
};

export default loggerMiddleware;
