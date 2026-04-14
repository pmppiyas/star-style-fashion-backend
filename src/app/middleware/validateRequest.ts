import { AppError } from '@app/error/appError';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.body && typeof req.body.body === 'string') {
        req.body = JSON.parse(req.body.body);
      }

      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
