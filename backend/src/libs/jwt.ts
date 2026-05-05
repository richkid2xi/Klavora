import jwt from 'jsonwebtoken';
import { getConfig } from '../config';
import { TokenPayload } from '../types';

export function generateAccessToken(payload: TokenPayload): string {
  const config = getConfig();
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  const config = getConfig();
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const config = getConfig();
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const config = getConfig();
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
}