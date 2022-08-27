import { reservationsService } from '@/services';
import { Request, Response } from 'express';
import { CreateReservationParams } from '@/repositories/reservation-repository';

export async function reserveTicket(req: Request, res: Response) {
  const reserveData: CreateReservationParams = { ...req.body };
  await reservationsService.createOrUpdateReservation(reserveData);
  res.sendStatus(201);
}

export async function getTicketReservation(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  const reservation = await reservationsService.getReservation(userId);
  res.status(200).send({ reservation });
}
