import app, { close, init } from '@/app';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config';
import { createReservation } from '../factories/reservations-facytory';
import { createPayment } from '../factories/payments-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('POST /payments', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/payments');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should response with status 401 if given token is not valid', async () => {
    const token = faker.random.alphaNumeric(10);

    const response = await server.post('/payments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.post('/payments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body is not present', async () => {
      const token = await generateValidToken();

      const response = await server.post('/payments').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post('/payments').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when body is valid', () => {
      const generateValidBody = (id: number) => ({
        userId: id,
        cardHolderName: faker.name.findName(),
        cardNumber: faker.finance.creditCardNumber(),
        cardExpiration: '02/99',
        total: 100,
      });

      it('should respond with status 404 if userId given is not valid', async () => {
        const userId = 999;
        const body = generateValidBody(userId);
        const token = await generateValidToken();

        const response = await server.post('/payments').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
        const payment = await prisma.payment.findFirst({ where: { userId } });
        expect(payment).toBe(null);
      });

      it('should respond with status 404 if user have no reservation created', async () => {
        const user = await createUser();
        const body = generateValidBody(user.id);
        const token = await generateValidToken();

        const response = await server.post('/payments').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        const payment = await prisma.payment.findFirst({ where: { userId: user.id } });
        expect(payment).toBe(null);
      });

      it('should respond with status 201 and create new payment', async () => {
        const user = await createUser();
        const body = generateValidBody(user.id);
        const token = await generateValidToken();
        await createEnrollmentWithAddress(user);
        await createReservation(user);

        const response = await server.post('/payments').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const payment = await prisma.payment.findFirst({ where: { userId: user.id } });
        expect(payment).toBeDefined();
      });
    });
  });
});

describe('GET /payments', () => {
  it('should respond with status 401 if no token is given', async () => {
    const user = await createUser();
    const response = await server.get(`/payments/${user.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const user = await createUser();
    const token = faker.lorem.word();

    const response = await server.get(`/payments/${user.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(`/payments/${userWithoutSession.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no payment for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken();

      const response = await server.get(`/payments/${user.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and payment data when there is a payment for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createReservation(user);
      const payment = await createPayment(user);

      const response = await server.get(`/payments/${user.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        payment: {
          id: payment.id,
          userId: payment.userId,
          cardHolderName: payment.cardHolderName,
          cardNumber: payment.cardNumber,
          cardExpiration: payment.cardExpiration,
          total: payment.total,
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
        },
      });
    });
  });
});
