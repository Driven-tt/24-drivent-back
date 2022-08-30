import paymentRepository, { CreatePaymentParams } from '@/repositories/payment-repository';
import reservationRepository from '@/repositories/reservation-repository';
import userRepository from '@/repositories/user-repository';
import { ReservationNotFoundError, UserNotFoundError } from './errors';

async function createPayment(paymentData: CreatePaymentParams) {
  const user = await userRepository.findById(paymentData.userId);

  if (!user) {
    throw UserNotFoundError();
  }

  const reservation = await reservationRepository.findByUserId(user.id);

  if (!reservation) {
    throw ReservationNotFoundError();
  }

  await paymentRepository.insert(paymentData);
}

export const paymentService = {
  createPayment,
};
