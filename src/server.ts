import dotenv from 'dotenv';
import prisma from '@/prisma';
import express, { Request, Response } from 'express';
import errorHandler from '@/util/errorHandler';
import ash from '@/util/asyncErrorHandler';
import getSeason from '@/handlers/getSeason';
import getTopSeasons from '@/handlers/getTopSeasons';

dotenv.config();

const main = async () => {
  const app = express();
  const port = process.env.PORT;

  console.log();

  app.get('/', (req, res) => {
    res.send('The best server in the world');
  });

  app.get('/season/:year', getSeason);
  app.get('/season', getTopSeasons);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};
main().then();
