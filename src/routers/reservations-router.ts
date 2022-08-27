import { Router } from 'express';
import { reserveTicket } from '@/controllers/reservations-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ReservationSchema } from '@/schemas/reservations-schemas';

const reservationRouter = Router();
reservationRouter.all('/*', authenticateToken);
reservationRouter.post('/', validateBody(ReservationSchema), reserveTicket);

export { reservationRouter };
