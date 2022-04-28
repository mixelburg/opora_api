import { Request, Response, NextFunction } from 'express';

const ash = (callback: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};

export default ash;
