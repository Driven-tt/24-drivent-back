import { ApplicationError } from '@/protocols';

export function UserNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User not found',
  };
}

export function PaymentNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Payment not found',
  };
}

export function ReservationNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Cannot confirm payment without reservation',
  };
}
