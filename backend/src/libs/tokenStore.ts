import { getRedisClient } from './redis';
import { createHash } from 'crypto';

export class TokenStore {
  private redis = getRedisClient();

  async storeRefreshToken(
    userId: string,
    tokenVersion: number,
    token: string,
    expiresInSeconds: number = 7 * 24 * 60 * 60
  ): Promise<void> {
    const key = `rtoken:${userId}:${tokenVersion}`;
    const hash = this.hashToken(token);
    await this.redis.set(key, hash, 'EX', expiresInSeconds);
  }

  async getRefreshTokenHash(
    userId: string,
    tokenVersion: number
  ): Promise<string | null> {
    const key = `rtoken:${userId}:${tokenVersion}`;
    return await this.redis.get(key);
  }

  async deleteRefreshToken(
    userId: string,
    tokenVersion: number
  ): Promise<void> {
    const key = `rtoken:${userId}:${tokenVersion}`;
    await this.redis.del(key);
  }

  async storePasswordResetToken(
    userId: string,
    token: string,
    expiresInSeconds: number = 3600
  ): Promise<void> {
    const key = `reset:${userId}`;
    const hash = this.hashToken(token);
    await this.redis.set(key, hash, 'EX', expiresInSeconds);
  }

  async getPasswordResetTokenHash(userId: string): Promise<string | null> {
    const key = `reset:${userId}`;
    return await this.redis.get(key);
  }

  async deletePasswordResetToken(userId: string): Promise<void> {
    const key = `reset:${userId}`;
    await this.redis.del(key);
  }

  async storeReferenceCounter(
    pharmacyId: string,
    type: string,
    dateStr: string
  ): Promise<number> {
    const key = `ref:${pharmacyId}:${type}:${dateStr}`;
    const count = await this.redis.incr(key);
    await this.redis.expire(key, 86400); // 24 hours
    return count;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async verifyRefreshToken(
    userId: string,
    tokenVersion: number,
    token: string
  ): Promise<boolean> {
    const storedHash = await this.getRefreshTokenHash(userId, tokenVersion);
    if (!storedHash) return false;

    const tokenHash = this.hashToken(token);
    return storedHash === tokenHash;
  }

  async verifyPasswordResetToken(
    userId: string,
    token: string
  ): Promise<boolean> {
    const storedHash = await this.getPasswordResetTokenHash(userId);
    if (!storedHash) return false;

    const tokenHash = this.hashToken(token);
    return storedHash === tokenHash;
  }
}

export const tokenStore = new TokenStore();