import authenticationService, { SignInParams } from '@/services/authentication-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import GitOAuth from '@/services/git-auth-service';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  const result = await authenticationService.signIn({ email, password });

  res.status(httpStatus.OK).send(result);
}

export async function GitOAuthSignin(req: Request, res: Response) {

  const { code }: { code: string } = req.body;

  const user = await GitOAuth(code);
  
  res.status(httpStatus.OK).send(user);
};