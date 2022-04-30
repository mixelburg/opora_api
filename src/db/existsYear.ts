import prisma from '@/prisma';

/**
 * Check if a year exists in the database
 * @param year The year to check
 */
const existsYear = async (year: any) => {
  if (isNaN(year)) {
    console.log('isNaN');
    throw new Error('Year must be a number');
  }

  const res = await prisma.season.findUnique({
    where: {
      year,
    },
  });
  if (res === null) {
    throw new Error(`Year ${year} does not exist in the database`);
  }
  return true;
};

export default existsYear;
