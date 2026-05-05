import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { getConfig } from '../config';
import prisma from '../libs/prisma';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const config = getConfig();
  
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      // Unique constraint violation
      next(new ConflictError('Duplicate entry'));
      return;
    }
    
    if (prismaError.code === 'P2025') {
      // Record not found
      next(new NotFoundError('Resource not found'));
      return;
    }
    
    if (prismaError.code === 'P2003') {
      // Foreign key constraint
      next(new BusinessError('Foreign key constraint violation'));
      return;
    }
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      details: config.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};