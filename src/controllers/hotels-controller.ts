import { bookRoomService, getAllHotelsService, getByHotelIdService } from '@/services';
import { Request, Response } from 'express';

interface HotelParams {
  hotelId: number;
}

interface RoomParams {
  roomId: number;
}

export async function getAllHotels(req: Request, res: Response) {
  const hotels = await getAllHotelsService();

  res.send(hotels);
}

export async function getHotelById(req: Request<HotelParams>, res: Response) {
  const { hotelId } = req.params;
  const hotel = await getByHotelIdService(hotelId);

  res.send(hotel);
}

export async function bookRoom(req: Request<RoomParams>, res: Response) {
  const { roomId } = req.params;

  const booking = await bookRoomService(roomId);

  res.send(booking);
}
