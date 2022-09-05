import { getAll, getByHotelId } from '@/repositories/hotels-repository';

export async function getAllHotelsService() {
  return await getAll();
}

export async function getByHotelIdService(hotelId: number) {
  const hotel = await getByHotelId(hotelId);

  if (!hotel) return "Hotel not found"

  return hotel
}
