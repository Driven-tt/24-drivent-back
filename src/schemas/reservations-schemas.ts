import Joi from 'joi';
import { CreateReservationParams } from '@/repositories/reservation-repository';

export const ReservationSchema = Joi.object<CreateReservationParams>({
  userId: Joi.number().required(),
  modality: Joi.string().valid('online', 'presential').required(),
  modalityPrice: Joi.number().min(0).required(),
  withAccommodation: Joi.bool().required(),
  accommodationPrice: Joi.number().min(0).required(),
});
