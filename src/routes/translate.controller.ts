import { translateRequest } from '../services/dto/translate.dto';
import express, { NextFunction, Request, Response } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import translateService from '../services/translate.service';
import { authenticationMiddleware } from '../middleware/authorizationMiddleware';
import { Header, TranslateRequest } from './dto/interfaces.dto';
const translateController = express.Router();

translateController.post(
  '/',
  authenticationMiddleware(),
  validateRequest('body', translateRequest),
  async function (
    req: Request<unknown, unknown, TranslateRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { languages, strings } = req.body;
      const { 'api-type': apiType, source } = req.headers as unknown as Header;
      const translations = await translateService.translate(strings, languages, source, apiType);
      res.status(200).send(translations);
    } catch (error) {
      next(error);
    }
  },
);

export default translateController;
