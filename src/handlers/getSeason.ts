import ash from '@/util/asyncErrorHandler';
import { Request, Response } from 'express';
import prisma from '@/prisma';
import getDriversByYear from '@/db/getDriversByYear';

const getSeason = ash(async (req: Request, res: Response) => {
  const { year } = req.params;

  // get full driver objects
  const drivers = await prisma.driver.findMany({
    where: {
      id: {
        in: await getDriversByYear(parseInt(year)),
      },
    },
  });

  return res.json(drivers);
});

export default getSeason;
