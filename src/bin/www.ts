import '../configuration/environment';
import 'elastic-apm-node/start';
import app from '../app';
import http from 'http';
import normalizePort from './normalizePort';
import errorHandler from './errorHandler';
import successHandler from './successHandler';

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', (error) => errorHandler(error, port as string));
server.on('listening', () => successHandler(server));
