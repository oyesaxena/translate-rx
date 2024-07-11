/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string | number): boolean | string | number => {
  const port = parseInt(val as string, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

export default normalizePort;
