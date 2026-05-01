import env from '../config/env.config';
import { AppError } from '../error/appError';
import { handleZodValidationError } from '../helper/errorHelperFunc';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const globalErrHandler = (
  err: any,
  req: Request,
  res: Response,
  nest: NextFunction
) => {
  let statusCode = StatusCodes.BAD_REQUEST;
  let message = `Something went wrong${err.message}`;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err.name === 'ZodError') {
    message = handleZodValidationError(err).message;
    statusCode = StatusCodes.NOT_ACCEPTABLE;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    err,
    stack: env.NODE_ENV === 'development' ? err.stack : '',
  });
};
