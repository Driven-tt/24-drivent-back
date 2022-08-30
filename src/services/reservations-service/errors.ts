import { ApplicationError } from '@/protocols';

export function UserNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User not found',
  };
}

export function ReservationNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Reservation not found',
  };
}

export function EnrollmentNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Cannot reserve ticket without subscription',
  };
}
