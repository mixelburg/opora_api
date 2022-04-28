import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import prisma from '@/prisma';

const getTopSeasons = ash(async (req: Request, res: Response) => {
  const result = (
    await prisma.season.findMany({
      select: {
        year: true,
      },
    })
  )
    .map((val) => val.year)
    .map((val: number) => {
      return {
        year: val,
        topDrivers: [],
      };
    });

  const driverIds = (
    await prisma.driverStanding.groupBy({
      by: ['driverId'],
      where: {
        race: {
          year: parseInt(req.params.year),
        },
        wins: true,
      },
      orderBy: {
        _count: {
          wins: 'desc',
        },
      },
    })
  ).map((val) => val.driverId);

  return res.json(result);
});

export default getTopSeasons;
