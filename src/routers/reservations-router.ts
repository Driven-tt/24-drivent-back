import { Router } from 'express';
import { getTicketReservation, reserveTicket } from '@/controllers/reservations-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ReservationSchema } from '@/schemas/reservations-schemas';

const reservationRouter = Router();
reservationRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(ReservationSchema), reserveTicket)
  .get('/:userId', getTicketReservation);

export { reservationRouter };
