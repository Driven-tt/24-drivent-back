import { bookingRoom, getAll, getByHotelId, getRoomById } from '@/repositories/hotels-repository';

export async function getAllHotelsService() {
  let hotels = await getAll();

}

export async function getByHotelIdService(hotelId: number) {
  const hotel = await getByHotelId(hotelId);

  if (!hotel) return 'Hotel not found';

  return hotel;
}

export async function bookRoomService(roomId: number) {
  const room = await getRoomById(roomId);
  const errorTypeRoomHandler = {
    Single: (roomGuests: number) => {
      if (roomGuests >= 1) return 'Dont have empty space';
    },
    Double: (roomGuests: number) => {
      if (roomGuests >= 2) return 'Dont have empty space';
    },
    Triple: (roomGuests: number) => {
      if (roomGuests >= 3) return 'Dont have empty space';
    },
  };

  if (!room) return 'Room dont found';
  if (errorTypeRoomHandler[room.type](room.numberGuests)) return errorTypeRoomHandler[room.type](room.numberGuests);

  await bookingRoom(roomId, room.numberGuests);
  return 'Booking with sucess';
}
