import { CreatePaymentParams } from '@/repositories/payment-repository';
import Joi from 'joi';

export const PaymentSchema = Joi.object<CreatePaymentParams>({
  userId: Joi.number().required(),
  total: Joi.number().min(0),
  cardHolderName: Joi.string().required(),
  cardNumber: Joi.string().required(),
  cardExpiration: Joi.string().required(),
});
