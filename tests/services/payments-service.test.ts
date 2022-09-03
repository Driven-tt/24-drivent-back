import { close, init } from '@/app';
import paymentRepository, { CreatePaymentParams } from '@/repositories/payment-repository';
import reservationRepository from '@/repositories/reservation-repository';
import userRepository from '@/repositories/user-repository';
import { paymentService } from '@/services/payments-service';
import { PaymentNotFoundError, UserNotFoundError, ReservationNotFoundError } from '@/services/payments-service/errors';
import { cleanDb } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('register payment', () => {
  it('should register', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(reservationRepository, 'findByUserId').mockImplementationOnce((): any => true);
    jest.spyOn(paymentRepository, 'insert').mockResolvedValueOnce(null);

    const params: CreatePaymentParams = {
      userId: 10,
      cardHolderName: 'Name',
      cardExpiration: '02/25',
      cardNumber: '5444321345675523',
      total: 200,
    };

    await paymentService.createPayment(params);
    expect(paymentRepository.insert).toBeCalled();
  });

  it('given invalid userId should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
    jest.spyOn(paymentRepository, 'insert').mockResolvedValueOnce(null);

    const params: CreatePaymentParams = {
      userId: 10,
      cardHolderName: 'Name',
      cardExpiration: '02/25',
      cardNumber: '5444321345675523',
      total: 200,
    };

    const promise = paymentService.createPayment(params);
    expect(promise).rejects.toEqual(UserNotFoundError());
    expect(paymentRepository.insert).not.toBeCalled();
  });

  it('given user with reservation should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(reservationRepository, 'findByUserId').mockImplementationOnce(null);
    jest.spyOn(paymentRepository, 'insert').mockResolvedValueOnce(null);

    const params: CreatePaymentParams = {
      userId: 10,
      cardHolderName: 'Name',
      cardExpiration: '02/25',
      cardNumber: '5444321345675523',
      total: 200,
    };

    const promise = paymentService.createPayment(params);
    expect(promise).rejects.toEqual(ReservationNotFoundError());
    expect(paymentRepository.insert).not.toBeCalled();
  });
});

describe('get payment data', () => {
  it('should return payment', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(paymentRepository, 'findByUserId').mockImplementationOnce((): any => 'result');
    const result = await paymentService.getPayment(1);
    expect(paymentRepository.findByUserId).toBeCalled();
    expect(result).toBe('result');
  });

  it('given invalid userId should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce(null);
    jest.spyOn(paymentRepository, 'findByUserId').mockResolvedValueOnce(null);

    const promise = paymentService.getPayment(1);
    expect(promise).rejects.toEqual(UserNotFoundError());
    expect(paymentRepository.findByUserId).not.toBeCalled();
  });

  it('given user with no payment should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(paymentRepository, 'findByUserId').mockResolvedValueOnce(null);

    const promise = paymentService.getPayment(1);
    expect(promise).rejects.toEqual(PaymentNotFoundError());
  });
});
