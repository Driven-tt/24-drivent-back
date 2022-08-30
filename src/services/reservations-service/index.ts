import userRepository from '@/repositories/user-repository';
import { EnrollmentNotFoundError, ReservationNotFoundError, UserNotFoundError } from './errors';
import reservationRepository, { CreateReservationParams } from '@/repositories/reservation-repository';
import { exclude } from '@/utils/prisma-utils';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function createOrUpdateReservation(reservationData: CreateReservationParams) {
  const user = await userRepository.findById(reservationData.userId);

  if (!user) {
    throw UserNotFoundError();
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(reservationData.userId);

  if (!enrollment) {
    throw EnrollmentNotFoundError();
  }

  const createReservation = { ...reservationData };
  const updateReservation = exclude(reservationData, 'userId');

  await reservationRepository.upsert(user.id, createReservation, updateReservation);
}

async function getReservation(userId: number) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw UserNotFoundError();
  }

  const result = await reservationRepository.findByUserId(userId);

  if (!result) {
    throw ReservationNotFoundError();
  }

  return result;
}

export const reservationsService = {
  createOrUpdateReservation,
  getReservation,
};
