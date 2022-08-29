import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createUser } from '../factories';
import { prisma } from '@/config';
import jwt from 'jsonwebtoken';
import { createReservation } from '../factories/reservations-facytory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /reservations', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/reservations');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should response with status 401 if given token is not valid', async () => {
    const token = faker.random.alphaNumeric(10);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body is not present', async () => {
      const token = await generateValidToken();

      const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when body is valid', () => {
      const generateValidBody = (id: number) => ({
        userId: id,
        modality: 'online',
        modalityPrice: 100,
        withAccommodation: false,
        accommodationPrice: 0,
      });

      it('should respond with status 201 and create new reservation', async () => {
        const user = await createUser();
        const body = generateValidBody(user.id);
        const token = await generateValidToken();

        const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const reservation = await prisma.reservation.findFirst({ where: { userId: user.id } });
        expect(reservation).toBeDefined();
      });

      it('should respond with status 200 and update reservation', async () => {
        const user = await createUser();
        const reservation = await createReservation(user);
        const body = generateValidBody(user.id);
        const token = await generateValidToken();

        const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.CREATED);
        const updatedReservation = await prisma.reservation.findMany({ where: { id: reservation.id } });
        expect(updatedReservation.length).toBe(1);
        expect(updatedReservation).toBeDefined();
        expect(updatedReservation[0]).toEqual(
          expect.objectContaining({
            id: reservation.id,
            ...body,
          }),
        );
      });
    });
  });
});
