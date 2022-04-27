import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIR_NAME = 'seeds';

const parseCSV = (fileName: string, onRow: (data: any) => any) => {
  // add wait for promises
  fs.createReadStream(path.resolve(__dirname, DIR_NAME, fileName))
    .pipe(csv.parse({ headers: true }))
    .on('error', (err: any) => console.error(err))
    .on('data', onRow)
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows from ${fileName}`));
};

const toNull = (val: string): null | string => {
  return val === '\\\\n' ? null : val;
};

const main = (): void => {
  try {
    parseCSV('seasons.csv', async (data: any) => {
      await prisma.season.create({
        data: {
          year: parseInt(data.year),
          url: data.url,
        },
      });
    });
    parseCSV('status.csv', async (data: any) => {
      await prisma.status.create({
        data: {
          id: parseInt(data.statusId),
          status: data.status,
        },
      });
    });
    parseCSV('constructors.csv', async (data: any) => {
      await prisma.raceConstructor.create({
        data: {
          id: parseInt(data.constructorId),
          ref: data.constructorRef,
          name: data.name,
          nationality: data.nationality,
          url: data.url,
        },
      });
    });
    parseCSV('drivers.csv', async (data: any) => {
      await prisma.driver.create({
        data: {
          id: parseInt(data.driverId),
          number: toNull(data.number) === null ? parseInt(data.number) : null,
          ref: data.driverRef,
          code: data.code,
          forename: data.forename,
          surname: data.surname,
          dob: data.dob,
          nationality: data.nationality,
          url: data.url,
        },
      });
    });
    parseCSV('circuits.csv', async (data: any) => {
      await prisma.circuit.create({
        data: {
          id: parseInt(data.circuitId),
          name: data.name,
          ref: data.circuitRef,
          location: data.location,
          country: data.country,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          alt: parseInt(data.alt),
          url: data.url,
        },
      });
    });
    parseCSV('races.csv', async (data: any) => {
      await prisma.race.create({
        data: {
          id: parseInt(data.raceId),
          year: parseInt(data.year),
          round: parseInt(data.round),
          circuitId: parseInt(data.circuitId),
          name: data.name,
          date: data.date,
          time: data.time,
          url: data.url,
        },
      });
    });
    parseCSV('lap_times.csv', async (data: any) => {
      await prisma.lapTime.create({
        data: {
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          lap: parseInt(data.lap),
          position: parseInt(data.position),
          time: data.time,
          milliseconds: parseInt(data.milliseconds),
        },
      });
    });
    parseCSV('pit_stops.csv', async (data: any) => {
      await prisma.pitStop.create({
        data: {
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          stop: parseInt(data.stop),
          lap: parseInt(data.lap),
          time: data.time,
          duration: parseFloat(data.duration),
          milliseconds: parseInt(data.milliseconds),
        },
      });
    });
    parseCSV('driver_standings.csv', async (data: any) => {
      await prisma.driverStanding.create({
        data: {
          id: parseInt(data.driverStandingsId),
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          points: parseInt(data.points),
          position: parseInt(data.position),
          positionText: data.positionText,
          wins: Boolean(parseInt(data.wins)),
        },
      });
    });
    parseCSV('constructor_standings.csv', async (data: any) => {
      await prisma.constructorStanding.create({
        data: {
          id: parseInt(data.constructorStandingsId),
          raceId: parseInt(data.raceId),
          constructorId: parseInt(data.constructorId),
          points: parseInt(data.points),
          position: parseInt(data.position),
          positionText: data.positionText,
          wins: Boolean(parseInt(data.wins)),
        },
      });
    });
    parseCSV('constructor_results.csv', async (data: any) => {
      await prisma.constructorResult.create({
        data: {
          id: parseInt(data.constructorResultsId),
          raceId: parseInt(data.raceId),
          constructorId: parseInt(data.constructorId),
          points: parseInt(data.points),
          status: toNull(data.status),
        },
      });
    });
    parseCSV('qualifying.csv', async (data: any) => {
      await prisma.qualification.create({
        data: {
          id: parseInt(data.qualifyId),
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          constructorId: parseInt(data.constructorId),
          number: parseInt(data.number),
          position: parseInt(data.position),
          q1: data.q1,
          q2: toNull(data.q2),
          q3: toNull(data.q3),
        },
      });
    });
    parseCSV('results.csv', async (data: any) => {
      await prisma.result.create({
        data: {
          id: parseInt(data.resultId),
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          constructorId: parseInt(data.constructorId),
          number: parseInt(data.number),
          grid: parseInt(data.grid),
          position: toNull(data.position) === null ? parseInt(data.position) : null,
          positionText: data.positionText,
          positionOrder: parseInt(data.positionOrder),
          points: parseInt(data.points),
          laps: parseInt(data.laps),
          time: toNull(data.time),
          milliseconds: toNull(data.milliseconds) === null ? parseInt(data.milliseconds) : null,
          fastestLap: toNull(data.fastestLap) === null ? parseInt(data.fastestLap) : null,
          fastestLapSpeed: toNull(data.fastestLapSpeed) === null ? parseFloat(data.fastestLapSpeed) : null,
          fastestLapTime: toNull(data.fastestLapTime),
          rank: toNull(data.rank) === null ? parseInt(data.rank) : null,
          statusId: parseInt(data.statusId),
        },
      });
    });
  } catch (e: any) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
};

main();
