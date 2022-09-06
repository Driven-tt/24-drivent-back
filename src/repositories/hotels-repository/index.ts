import { prisma } from '@/config';

export async function getAll() {
  return prisma.hotels.findMany({});
}

export async function getByHotelId(hotelId: number) {
  return prisma.hotels.findUnique({
    where: { id: +hotelId },
    include: {
      Rooms: { orderBy: { id: 'asc' } },
    },
  });
}

export async function getRoomById(roomId: number) {
  return prisma.rooms.findUnique({ where: { id: +roomId } });
}

export async function bookingRoom(roomId: number, numberGuests: number) {
  return prisma.rooms.update({
    where: { id: +roomId },
    data: {
      numberGuests: numberGuests + 1,
    },
  });
}
