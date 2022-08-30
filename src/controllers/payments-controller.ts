import { CreatePaymentParams } from '@/repositories/payment-repository';
import { paymentService } from '@/services/payments-service';
import { Request, Response } from 'express';

export async function registerPayment(req: Request, res: Response) {
  const paymentData: CreatePaymentParams = { ...req.body };
  await paymentService.createPayment(paymentData);
  res.sendStatus(201);
}

export async function getPayment(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  const payment = await paymentService.getPayment(userId);
  res.status(200).send({ payment });
}
