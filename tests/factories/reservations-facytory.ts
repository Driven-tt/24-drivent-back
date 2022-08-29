import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createReservation(user?: User) {
  const incomingUser = user || (await createUser());
  const modality = Math.random() > 0.5 ? 'online' : 'presential';

  return prisma.reservation.create({
    data: {
      userId: incomingUser.id,
      modality,
      modalityPrice: 100,
      withAccommodation: false,
      accommodationPrice: 0,
    },
  });
}
