import { AppError } from '@app/error/appError';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const raw = req.body?.body || req.body?.data || req.body;

      if (typeof raw === 'string') {
        req.body = JSON.parse(raw);
      } else {
        req.body = raw;
      }

      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
