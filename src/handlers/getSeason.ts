import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import prisma from '@/prisma';

const getSeason = ash(async (req: Request, res: Response) => {
  // check if given year is a number
  if (isNaN(parseInt(req.params.year))) {
    return res.status(400).send('year must be a number');
  }

  // check if given year exists, otherwise return error
  if (
    (await prisma.season.findUnique({
      where: {
        year: parseInt(req.params.year),
      },
    })) === null
  ) {
    return res.status(400).send('year does not exist');
  }
  // get all driver id's sorted by their wins in a giver season
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

  // get full driver objects
  const drivers = await prisma.driver.findMany({
    where: {
      id: {
        in: driverIds,
      },
    },
  });

  return res.json(drivers);
});

export default getSeason;
