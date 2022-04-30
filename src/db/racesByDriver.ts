import prisma from '@/prisma';

const racesByDriver = async (driverId: number) => {
  return await prisma.$queryRaw`
    SELECT R.name as race_name,
           C.name as circuit_name,
           avg(LT.milliseconds) as avg_lap_time,
           max(LT.milliseconds) as max_lap_time,
           min(LT.milliseconds) as min_lap_time,
           count(PS.stop) as number_of_stops,
           avg(PS.milliseconds) as avg_stop_time,
           max(PS.milliseconds) as max_stop_time,
           min(PS.milliseconds) as min_stop_time,
           R."timeStamp" as race_date,
           DS.points as points,
           DS.position as position
    FROM "DriverStanding" DS
        JOIN "Race" R on R.id = DS."raceId"
        JOIN "Circuit" C on C.id = R."circuitId"
        JOIN "LapTime" LT on R.id = LT."raceId"
        JOIN "PitStop" PS on R.id = PS."raceId"
    WHERE DS."driverId" = ${driverId}
    GROUP BY R.name, R."timeStamp", C.name, DS.points, DS.position
  `;
};

export default racesByDriver;
