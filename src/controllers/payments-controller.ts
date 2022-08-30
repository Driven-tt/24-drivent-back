import { CreatePaymentParams } from '@/repositories/payment-repository';
import { paymentService } from '@/services/payments-service';
import { Request, Response } from 'express';

export async function registerPayment(req: Request, res: Response) {
  const paymentData: CreatePaymentParams = { ...req.body };
  await paymentService.createPayment(paymentData);
  res.sendStatus(201);
}
