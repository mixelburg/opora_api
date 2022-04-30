import dotenv from 'dotenv';
import express from 'express';
import errorHandler from '@/util/errorHandler';
import getSeason from '@/handlers/getSeason';
import getTopSeasons from '@/handlers/getTopSeasons';
import getRacesByDriver from '@/handlers/getRacesByDriver';
import { param } from 'express-validator';
import existsYear from '@/db/existsYear';
import existsDriverId from '@/db/existsDriverId';
import rejectOnError from '@/util/rejectOnError';

dotenv.config();

const main = async () => {
  const app = express();
  const port = process.env.PORT;

  app.get('/', (req, res) => {
    res.send('The best server in the world');
  });

  // this should be moved to a separate router if it grows
  app.get('/season/:year', param('year').exists().isInt().toInt().custom(existsYear), rejectOnError, getSeason);
  app.get('/season', getTopSeasons);
  app.get(
    '/driver/:driverId',
    param('driverId').exists().isInt().toInt().custom(existsDriverId),
    rejectOnError,
    getRacesByDriver,
  );

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};
main().then();
