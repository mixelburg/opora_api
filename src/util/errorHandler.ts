import { Request, Response, NextFunction } from 'express';

const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    err: err.message,
  });
};

export default ErrorHandler;
