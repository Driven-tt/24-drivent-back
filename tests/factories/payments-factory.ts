import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createPayment(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.payment.create({
    data: {
      userId: incomingUser.id,
      cardHolderName: faker.name.findName(),
      cardNumber: faker.finance.creditCardNumber(),
      cardExpiration: '09/99',
      total: 100,
    },
  });
}
