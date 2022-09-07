import { ApplicationError } from '@/protocols';

export function invalidGitCode(err: string): ApplicationError {
  return {
    name: 'invalidGitCode',
    message: 'code are incorrect: ' + err,
  };
}

export function errorSearchingUser(err: string): ApplicationError {
    return {
        name: 'errorSearchingUser',
        message: 'error when searching for git user: ' + err
    };
}