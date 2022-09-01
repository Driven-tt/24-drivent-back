import paymentRepository, { CreatePaymentParams } from '@/repositories/payment-repository';
import reservationRepository from '@/repositories/reservation-repository';
import userRepository from '@/repositories/user-repository';
import { PaymentNotFoundError, ReservationNotFoundError, UserNotFoundError } from './errors';

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

async function getPayment(userId: number) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw UserNotFoundError();
  }

  const result = await paymentRepository.findByUserId(userId);

  if (!result) {
    throw PaymentNotFoundError();
  }

  return result;
}

export const paymentService = {
  createPayment,
  getPayment,
};
