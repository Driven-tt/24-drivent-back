import { Reservation } from '@prisma/client';
import { prisma } from '@/config';

async function upsert(
  userId: number,
  createdReservation: CreateReservationParams,
  updatedReservation: UpdateReservationParams,
) {
  return prisma.reservation.upsert({
    where: {
      userId,
    },
    create: createdReservation,
    update: updatedReservation,
  });
}

async function findByUserId(userId: number) {
  return prisma.reservation.findUnique({
    where: {
      userId,
    },
  });
}

export type CreateReservationParams = Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateReservationParams = Omit<CreateReservationParams, 'userId'>;

const reservationRepository = {
  upsert,
  findByUserId,
};

export default reservationRepository;
