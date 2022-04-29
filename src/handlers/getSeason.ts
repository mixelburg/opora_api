import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import prisma from '@/prisma';
import getDriversByYear from '@/db/getDriversByYear';

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
  // get full driver objects
  const drivers = await prisma.driver.findMany({
    where: {
      id: {
        in: await getDriversByYear(parseInt(req.params.year)),
      },
    },
  });

  return res.json(drivers);
});

export default getSeason;
