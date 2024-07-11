import { z } from 'zod';
import { NextFunction, Response, Request } from 'express';
import { validateSchema } from '../util/validateSchema';

type RequestLocation = 'query' | 'body' | 'params';

export function validateRequest(location: RequestLocation, schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let _location: any;
    switch (location) {
      case 'query':
        _location = req.query;
        break;
      case 'body':
        _location = req.body;
        break;
      case 'params':
        _location = req.params;
        break;
    }
    try {
      await validateSchema(_location, schema);
    } catch (error) {
      next(error);
    }
    next();
  };
}
