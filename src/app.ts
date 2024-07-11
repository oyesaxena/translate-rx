import 'elastic-apm-node/start';
import apm from 'elastic-apm-node';
import tracer from 'cls-rtracer';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import translateController from './routes/translate.controller';
import healthCheckController from './routes/healthCheck.controller';
import logger, { handler } from './util/Logger';
import ResponseError from './util/dto/ResponseError.dto';
import transliterateController from './routes/transliterate.controller';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'local') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}

process.on('unhandledRejection', (error: any) => {
  if (error.isAxiosError) {
    const response = error.response;

    const responseMap = {
      url: error?.config?.url,
      status: response?.status,
      responseData: response?.data,
    };

    // eslint-disable-next-line no-console
    console.log(`
        Unhandled API error
        ${JSON.stringify(responseMap)}
      `);
  }
});

const app = express();

app.use(tracer.expressMiddleware({ useHeader: true }));
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(handler);

app.use('/translate', translateController);
app.use('/transliterate', transliterateController);
app.use('/pod/readiness', healthCheckController);

// error handler
// eslint-disable-next-line sonarjs/cognitive-complexity
app.use((err: ResponseError, _req: Request, res: Response, _next: NextFunction) => {
  const error = JSON.stringify(err);
  logger.error(err.stack, `Error: ${error}`);
  apm?.captureError(err, {
    labels: {
      ERROR_TYPE: 'API Failure',
    },
    custom: {
      requestData: {
        url: _req?.url,
        method: _req?.method,
        data: _req?.body,
      },
      responseData: {
        statusCode: err?.statusCode || err.status || 500,
        message: err?.message,
      },
      errorData: {
        error: res.statusMessage || err?.message,
      },
    },
    parent: apm?.currentTransaction,
  });
  res.status(err.status || 500).json({
    statusCode: err?.statusCode || err.status || 500,
    error: res.statusMessage || err?.message,
    message: err?.message,
    stack: process.env.NODE_ENV === 'local' ? err.stack : undefined,
  });
});

export default app;
