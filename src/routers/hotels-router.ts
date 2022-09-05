import { bookRoom, getAllHotels, getHotelById } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const hotelRouter = Router();

hotelRouter
  //   .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get('/:hotelId', getHotelById)
  .post('/:roomId', bookRoom);

export { hotelRouter };
