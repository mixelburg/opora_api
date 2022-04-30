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
  // could be optimized using raw sql queries
  // but this is a small project
  // there is not much to gain from that
  for (const season of seasons) {
    // taking first 3 could be done only with raw sql in prisma
    data[season] = (await getDriversByYear(season)).slice(0, 3);
  }

  return res.json(data);
});

export default getTopSeasons;
