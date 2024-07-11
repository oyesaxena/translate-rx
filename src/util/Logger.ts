import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';
import ecsFormat from '@elastic/ecs-pino-format';
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import tracer from 'cls-rtracer';

const options = process.env.NODE_ENV
  ? ecsFormat()
  : pretty({
      colorize: true,
    });

const logger: Logger = pino(options);
export const handler = pinoHttp({
  logger,
  genReqId: function (req: Request, res: Response) {
    if (req.id) return req.id;
    let id = req.get('X-Request-Id');
    if (id) return id;
    id = (tracer.id() as string) || randomUUID();
    res.header('X-Request-Id', id);
    return id;
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
  },
  redact: ['req.headers["x-authorization"]'],
  serializers: {
    request: (req: Request) => ({
      headers: req.headers,
      id: req.id,
      method: req.method,
      url: req.url,
      body: req.body?.length,
    }),
    response: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default logger;
