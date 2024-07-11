import { UnauthorizedError, ForbiddenError } from '../util/errors';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { tokenSecret, tokens } from '../configuration/environment';
import { ApiType } from '../services/dto/translate.dto';
import logger from '../util/Logger';

export const authenticationMiddleware =
  (): ((req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.['x-authorization'];

      if (!token) throw new UnauthorizedError('Unauthorized');

      const verifiedToken = verifyToken(token as string);
      if (verifiedToken) {
        req.headers.source = verifiedToken.source;
        req.headers.access = verifiedToken.access;
        if (cannotAccessPaidVersion(req.headers)) {
          throw new ForbiddenError('Paid Access Not Allowed');
        }

        next();
        return;
      }
    } catch (error) {
      next(error);
    }
  };

type Access = ApiType | 'ADMIN';

interface ITokenData {
  source: string;
  access: Access;
}

function cannotAccessPaidVersion(headers: Record<string, string | string[]>) {
  return (
    headers?.['api-type'] === ApiType.PAID &&
    !(headers?.['api-type'] === ApiType.PAID && headers.access !== ApiType.FREE)
  );
}

function verifyToken(token: string): ITokenData {
  if (tokens.includes(token)) {
    try {
      return verify(token, tokenSecret, { complete: false }) as unknown as ITokenData;
    } catch (err) {
      logger.error(err);
    }
  }
  throw new ForbiddenError('Forbidden');
}
