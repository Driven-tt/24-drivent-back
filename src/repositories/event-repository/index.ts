import { prisma, redis } from '@/config';
import { Event } from '@prisma/client';

async function findFirst() {
  const cacheKey = 'event';
  let event: Event | string = await redis.get(cacheKey);

  if (!event) {
    event = await prisma.event.findFirst();
    await redis.set(cacheKey, JSON.stringify(event));
    return event;
  }

  return JSON.parse(event) as Event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
