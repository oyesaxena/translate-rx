/**
 * Event listener for HTTP server "error" event.
 */
import { HandlerError } from '../util/dto/HandlerError.dto';
import logger from '../util/Logger';

const errorHandler = (error: HandlerError, port: string | number): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

export default errorHandler;
