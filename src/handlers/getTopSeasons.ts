import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import seasonsStats from '@/db/seasonsStats';

const getTopSeasons = ash(async (req: Request, res: Response) => {
  const data = await seasonsStats();

  return res.json(data);
});

export default getTopSeasons;
