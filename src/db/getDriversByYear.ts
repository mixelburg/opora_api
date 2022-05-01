import prisma from '@/prisma';

/**
 * Get all a list of best drivers by year
 * @param year a year to search
 */
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
        _sum: {
          points: 'desc',
        },
      },
    })
  ).map((val) => val.driverId);
};

export default getDriversByYear;
