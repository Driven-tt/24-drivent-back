-- CreateEnum
CREATE TYPE "TicketModality" AS ENUM ('online', 'presential');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "modality" "TicketModality" NOT NULL,
    "modalityPrice" INTEGER NOT NULL,
    "withAccommodation" BOOLEAN NOT NULL,
    "accommodationPrice" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
