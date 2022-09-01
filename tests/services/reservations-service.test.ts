import { init } from '@/app';
import reservationRepository, { CreateReservationParams } from '@/repositories/reservation-repository';
import userRepository from '@/repositories/user-repository';
import { reservationsService } from '@/services';
import { cleanDb } from '../helpers';
import {
  EnrollmentNotFoundError,
  ReservationNotFoundError,
  UserNotFoundError,
} from '@/services/reservations-service/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('reserve ticket', () => {
  it('should create reservation', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => true);
    jest.spyOn(reservationRepository, 'upsert').mockReturnValueOnce(null);

    const params: CreateReservationParams = {
      userId: 100,
      modality: 'online',
      modalityPrice: 100,
      withAccommodation: false,
      accommodationPrice: 0,
    };

    await reservationsService.createOrUpdateReservation(params);
    expect(reservationRepository.upsert).toBeCalled();
  });

  it('given invalid userId should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => false);
    jest.spyOn(reservationRepository, 'upsert').mockReturnValueOnce(null);

    const params: CreateReservationParams = {
      userId: 100,
      modality: 'online',
      modalityPrice: 100,
      withAccommodation: false,
      accommodationPrice: 0,
    };

    const promise = reservationsService.createOrUpdateReservation(params);
    expect(promise).rejects.toEqual(UserNotFoundError());
    expect(reservationRepository.upsert).not.toBeCalled();
  });

  it('given user with no enrollment should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => false);
    jest.spyOn(reservationRepository, 'upsert').mockReturnValueOnce(null);

    const params: CreateReservationParams = {
      userId: 100,
      modality: 'online',
      modalityPrice: 100,
      withAccommodation: false,
      accommodationPrice: 0,
    };

    const promise = reservationsService.createOrUpdateReservation(params);
    expect(promise).rejects.toEqual(EnrollmentNotFoundError());
    expect(reservationRepository.upsert).not.toBeCalled();
  });
});

describe('get reservation data', () => {
  it('should return reservation', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(reservationRepository, 'findByUserId').mockImplementationOnce((): any => 'result');

    const result = await reservationsService.getReservation(1);

    expect(reservationRepository.findByUserId).toBeCalled();
    expect(result).toBe('result');
  });

  it('given invalid userId should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => null);

    const promise = reservationsService.getReservation(1);
    expect(promise).rejects.toEqual(UserNotFoundError());
  });

  it('given user with no reservation should throw not found error', async () => {
    jest.spyOn(userRepository, 'findById').mockImplementationOnce((): any => true);
    jest.spyOn(reservationRepository, 'findByUserId').mockImplementationOnce((): any => null);

    const promise = reservationsService.getReservation(1);
    expect(promise).rejects.toEqual(ReservationNotFoundError());
  });
});
