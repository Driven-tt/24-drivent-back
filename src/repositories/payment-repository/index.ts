import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type CreatePaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function insert(params: CreatePaymentParams) {
  return prisma.payment.create({
    data: params,
  });
}

async function findByUserId(userId: number) {
  return prisma.payment.findUnique({
    where: {
      userId,
    },
  });
}

const paymentRepository = {
  insert,
  findByUserId,
};

export default paymentRepository;
