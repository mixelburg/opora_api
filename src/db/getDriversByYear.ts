import prisma from '@/prisma';

const getDriversByYear = async (year: number): Promise<number[]> => {
  return (
    await prisma.driverStanding.groupBy({
      by: ['driverId'],
      where: {
        race: {
          year: year,
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
};

export default getDriversByYear;
