import { transliterateRequest } from '../services/dto/translate.dto';
import express, { NextFunction, Request, Response } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticationMiddleware } from '../middleware/authorizationMiddleware';
import transliterationService from '../services/transliterate.service';
import { Header, TransliterateRequest } from './dto/interfaces.dto';
const transliterateController = express.Router();

transliterateController.post(
  '/',
  authenticationMiddleware(),
  validateRequest('body', transliterateRequest),
  async function (
    req: Request<unknown, unknown, TransliterateRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { languages, name } = req.body;
      const { 'api-type': apiType, source } = req.headers as unknown as Header;
      const translations = await transliterationService.transliterate(
        name,
        languages,
        source,
        apiType,
      );
      res.status(200).send(translations);
    } catch (error) {
      next(error);
    }
  },
);

export default transliterateController;
