/**
 * Event listener for HTTP server "listening" event.
 */

import { Server } from 'http';
import logger from '../util/Logger';

const successHandler = (server: Server): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
};

export default successHandler;
