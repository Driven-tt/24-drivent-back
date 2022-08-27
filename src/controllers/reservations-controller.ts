import { reservationsService } from '@/services';
import { Request, Response } from 'express';
import { CreateReservationParams } from '@/repositories/reservation-repository';

export async function reserveTicket(req: Request, res: Response) {
  const reserveData: CreateReservationParams = { ...req.body };
  await reservationsService.createOrUpdateReservation(reserveData);
  res.sendStatus(201);
}
