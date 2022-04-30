import prisma from '@/prisma';

/**
 * Check if driver exists
 * @param driverId the id to check
 */
const existsDriverId = async (driverId: number) => {
  if (isNaN(driverId)) {
    console.log('isNaN');
    throw new Error('driverId must be a number');
  }

  const res = await prisma.driver.findUnique({
    where: {
      id: driverId,
    },
  });
  if (res === null) {
    throw new Error(`Driver id ${driverId} does not exist`);
  }
  return true;
};

export default existsDriverId;
