import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import prisma from '@/prisma';
import getDriversByYear from '@/db/getDriversByYear';

const getTopSeasons = ash(async (req: Request, res: Response) => {
  // get the list of all seasons
  const seasons = (
    await prisma.season.findMany({
      select: {
        year: true,
      },
    })
  ).map((val) => val.year);

  const data: { [key: string]: number[] } = {};

  // get best drivers for each season
  for (const season of seasons) {
    data[season] = await getDriversByYear(season);
  }

  return res.json(data);
});

export default getTopSeasons;
