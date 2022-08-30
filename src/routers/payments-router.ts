import { getPayment, registerPayment } from '@/controllers/payments-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { PaymentSchema } from '@/schemas/payments-schemas';
import { Router } from 'express';

const paymentRouter = Router();

paymentRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(PaymentSchema), registerPayment)
  .get('/:userId', getPayment);

export { paymentRouter };
