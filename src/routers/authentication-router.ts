import { singInPost, GitOAuthSignin } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema, GitOAuthSchema } from '@/schemas';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/git-auth', validateBody(GitOAuthSchema), GitOAuthSignin);

export { authenticationRouter };