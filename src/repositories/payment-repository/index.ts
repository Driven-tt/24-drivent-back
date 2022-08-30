import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type CreatePaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function insert(params: CreatePaymentParams) {
  return prisma.payment.create({
    data: params,
  });
}

const paymentRepository = {
  insert,
};

export default paymentRepository;
