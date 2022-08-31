import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

export let redis: RedisClientType;

export async function connectRedis(): Promise<void> {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  try {
    await redis.connect();
    console.log('redis connected !'); // eslint-disable-line
  } catch {
    console.log('redis error !'); // eslint-disable-line
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis?.disconnect();
}
