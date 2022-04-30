import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import racesByDriver from '@/db/racesByDriver';

const getRacesByDriver = ash(async (req: Request, res: Response) => {
  const { driverId } = req.params;

  return res.json(await racesByDriver(parseInt(driverId)));
});

export default getRacesByDriver;
