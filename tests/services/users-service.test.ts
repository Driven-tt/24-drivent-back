import { init } from '@/app';
import { prisma } from '@/config';
import userService, { duplicatedEmailError } from '@/services/users-service';
import faker from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { createEvent, createUser as createUserSeed } from '../factories';
import { cleanDb } from '../helpers';
import eventsService from '@/services/events-service';
import { cannotEnrollBeforeStartDateError } from '@/errors';
import userRepository from '@/repositories/user-repository';

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('createUser', () => {
  it('should throw CannotEnrollBeforeStartDateError if event is not active', async () => {
    jest.spyOn(eventsService, 'isCurrentEventActive').mockResolvedValueOnce(false);
    jest.spyOn(userRepository, 'create').mockRejectedValueOnce(null);

    const promise = userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    expect(promise).rejects.toEqual(cannotEnrollBeforeStartDateError());
    expect(userRepository.create).not.toBeCalled();
  });

  it('should throw duplicatedUserError if there is a user with given email', async () => {
    await createEvent();
    const existingUser = await createUserSeed();

    try {
      await userService.createUser({
        email: existingUser.email,
        password: faker.internet.password(6),
      });
      fail('should throw duplicatedUserError');
    } catch (error) {
      expect(error).toEqual(duplicatedEmailError());
    }
  });

  it('should create user when given email is unique', async () => {
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(user).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        email: dbUser.email,
      }),
    );
  });

  it('should hash user password', async () => {
    jest.spyOn(eventsService, 'isCurrentEventActive').mockResolvedValueOnce(true);
    const rawPassword = faker.internet.password(6);
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: rawPassword,
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(dbUser.password).not.toBe(rawPassword);
    expect(await bcrypt.compare(rawPassword, dbUser.password)).toBe(true);
  });
});
