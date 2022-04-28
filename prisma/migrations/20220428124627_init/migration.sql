-- CreateTable
CREATE TABLE "Circuit" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "alt" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "number" INTEGER,
    "code" TEXT NOT NULL,
    "forename" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "circuitId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "year" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceConstructor" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "RaceConstructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructorResult" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT,

    CONSTRAINT "ConstructorResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapTime" (
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "milliseconds" INTEGER NOT NULL,

    CONSTRAINT "LapTime_pkey" PRIMARY KEY ("raceId","driverId","lap")
);

-- CreateTable
CREATE TABLE "PitStop" (
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "stop" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "milliseconds" INTEGER NOT NULL,

    CONSTRAINT "PitStop_pkey" PRIMARY KEY ("raceId","driverId","stop")
);

-- CreateTable
CREATE TABLE "DriverStanding" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "positionText" TEXT NOT NULL,
    "wins" BOOLEAN NOT NULL,

    CONSTRAINT "DriverStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructorStanding" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "positionText" TEXT NOT NULL,
    "wins" BOOLEAN NOT NULL,

    CONSTRAINT "ConstructorStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "q1" TEXT NOT NULL,
    "q2" TEXT,
    "q3" TEXT,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "constructorId" INTEGER NOT NULL,
    "number" INTEGER,
    "grid" INTEGER NOT NULL,
    "position" INTEGER,
    "positionText" TEXT NOT NULL,
    "positionOrder" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "laps" INTEGER NOT NULL,
    "time" TEXT,
    "milliseconds" INTEGER,
    "fastestLap" INTEGER,
    "rank" INTEGER,
    "fastestLapTime" TEXT,
    "fastestLapSpeed" DOUBLE PRECISION,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_key" ON "Season"("year");

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructorResult" ADD CONSTRAINT "ConstructorResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructorResult" ADD CONSTRAINT "ConstructorResult_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "RaceConstructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapTime" ADD CONSTRAINT "LapTime_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapTime" ADD CONSTRAINT "LapTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitStop" ADD CONSTRAINT "PitStop_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitStop" ADD CONSTRAINT "PitStop_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverStanding" ADD CONSTRAINT "DriverStanding_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverStanding" ADD CONSTRAINT "DriverStanding_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructorStanding" ADD CONSTRAINT "ConstructorStanding_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructorStanding" ADD CONSTRAINT "ConstructorStanding_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "RaceConstructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "RaceConstructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "RaceConstructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
