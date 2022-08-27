import { ApplicationError } from '@/protocols';

export function UserNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User not found',
  };
}
