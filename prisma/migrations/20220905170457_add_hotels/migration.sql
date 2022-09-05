-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('Single', 'Double', 'Triple');

-- CreateTable
CREATE TABLE "Hotels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "numberGuests" INTEGER NOT NULL DEFAULT 0,
    "type" "RoomType" NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
