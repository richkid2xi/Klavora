import Redis from 'ioredis';
import { getConfig } from '../config';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (redis) return redis;
  
  const config = getConfig();
  redis = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) {
        console.error('Redis connection failed after 3 retries');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });
  
  redis.on('error', (err) => {
    console.error('Redis error:', err.message);
  });
  
  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });
  
  return redis;
}

export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  await client.connect();
}

export default getRedisClient;