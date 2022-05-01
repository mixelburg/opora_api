import prisma from '@/prisma';

const seasonsStats = async () => {
  return await prisma.$queryRaw`
    SELECT S.year,
       (
           SELECT (json_agg(cast(t."driverId" as text))) as top_drivers
           FROM (
                    SELECT "DriverStanding"."driverId"
                    FROM "Race"
                             JOIN "DriverStanding" ON "DriverStanding"."raceId" = "Race".id
                    WHERE "Race".year = S.year
                    GROUP BY "DriverStanding"."driverId"
                    ORDER BY sum("DriverStanding".points) DESC
                    LIMIT 3
                ) t
       )
    FROM "Season" S
    ORDER BY S.year DESC;
  `;
};

export default seasonsStats;
