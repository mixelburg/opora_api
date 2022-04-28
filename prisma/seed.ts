import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIR_NAME = 'seeds';

/**
 * Parses csv file and collects all data in an array
 * after that executes callback on each row in chunks and awaits for each chunk to complete
 * @param fileName name of the file to parse
 * @param onRow callback to execute on each row
 */
const parseCSV = async (fileName: string, onRow: (data: any) => Promise<void>) => {
  const data: any[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, DIR_NAME, fileName))
      .pipe(csv.parse({ headers: true }))
      .on('error', (err: any) => {
        reject(err);
      })
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows from ${fileName}`);
        resolve(void 0);
      });
  });

  // for now there is no other solution rather than
  // collecting all data in an array and executing it in chunks
  const chunkSize = 10;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await Promise.all(chunk.map(onRow));
  }
};

// checking for nulls in csv files (represented by '\n')
const isNull = (val: string): boolean => val.toLowerCase() === '\\\\n' || val.toLowerCase() === '\\n';
const toNull = (val: string): null | string => (isNull(val) ? null : val);
const toNullOrInt = (val: string): null | number => (isNull(val) ? null : parseInt(val));
const toNullOrFloat = (val: string): null | number => (isNull(val) ? null : parseFloat(val));

const main = async (): Promise<void> => {
  try {
    await parseCSV('seasons.csv', async (data: any) => {
      await prisma.season.create({
        data: {
          year: parseInt(data.year),
          url: data.url,
        },
      });
    });
    await parseCSV('status.csv', async (data: any) => {
      await prisma.status.create({
        data: {
          id: parseInt(data.statusId),
          status: data.status,
        },
      });
    });
    await parseCSV('constructors.csv', async (data: any) => {
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
    await parseCSV('drivers.csv', async (data: any) => {
      await prisma.driver.create({
        data: {
          id: parseInt(data.driverId),
          number: toNullOrInt(data.number),
          ref: data.driverRef,
          code: data.code,
          forename: data.forename,
          surname: data.surname,
          dob: new Date(data.dob),
          nationality: data.nationality,
          url: data.url,
        },
      });
    });
    await parseCSV('circuits.csv', async (data: any) => {
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
    await parseCSV('races.csv', async (data: any) => {
      await prisma.race.create({
        data: {
          id: parseInt(data.raceId),
          year: parseInt(data.year),
          round: parseInt(data.round),
          circuitId: parseInt(data.circuitId),
          timeStamp: isNull(data.time) ? new Date(data.date) : new Date(data.date + ' ' + data.time),
          name: data.name,
          url: data.url,
        },
      });
    });
    await parseCSV('lap_times.csv', async (data: any) => {
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
    await parseCSV('pit_stops.csv', async (data: any) => {
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
    await parseCSV('driver_standings.csv', async (data: any) => {
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
    await parseCSV('constructor_standings.csv', async (data: any) => {
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
    await parseCSV('constructor_results.csv', async (data: any) => {
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
    await parseCSV('qualifying.csv', async (data: any) => {
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
    await parseCSV('results.csv', async (data: any) => {
      await prisma.result.create({
        data: {
          id: parseInt(data.resultId),
          raceId: parseInt(data.raceId),
          driverId: parseInt(data.driverId),
          constructorId: parseInt(data.constructorId),
          number: toNullOrInt(data.number),
          grid: parseInt(data.grid),
          position: toNullOrInt(data.position),
          positionText: data.positionText,
          positionOrder: parseInt(data.positionOrder),
          points: parseInt(data.points),
          laps: parseInt(data.laps),
          time: toNull(data.time),
          milliseconds: toNullOrInt(data.milliseconds),
          fastestLap: toNullOrInt(data.fastestLap),
          fastestLapSpeed: toNullOrFloat(data.fastestLapSpeed),
          fastestLapTime: toNull(data.fastestLapTime),
          rank: toNullOrInt(data.rank),
          statusId: parseInt(data.statusId),
        },
      });
    });
  } catch (e: any) {
    console.error(e);
  } finally {
    console.log('[+] Finished');
    prisma.$disconnect();
  }
};

main().then();
