import { getRedisClient } from '../libs/redis';

const TYPE_PREFIXES: Record<string, string> = {
  SALE: 'SL',
  PURCHASE: 'PO',
  RETURN: 'RT',
  ADJUSTMENT: 'ADJ',
  DISPENSE: 'DP',
};

export async function generateReferenceNumber(
  pharmacyId: string,
  type: string
): Promise<string> {
  const redis = getRedisClient();
  const prefix = TYPE_PREFIXES[type] || 'TX';
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const key = `ref:${pharmacyId}:${type}:${dateStr}`;
  
  // Increment counter in Redis
  const sequence = await redis.incr(key);
  
  // Set expiry to 24 hours
  await redis.expire(key, 86400);
  
  // Format: PREFIX-YYYYMMDD-XXXX
  return `TXN-${prefix}-${dateStr}-${sequence.toString().padStart(4, '0')}`;
}