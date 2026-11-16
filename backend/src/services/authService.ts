import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { z } from 'zod';
import * as sessionService from './sessionService';

const JWT_SECRET = process.env['JWT_SECRET'];
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
const IDLE_TIMEOUT_MINUTES = 30;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const generateAccessToken = (userId: string, email: string, sessionId: string) => {
  return jwt.sign({ id: userId, email, sessionId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const register = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });

  const refreshToken = sessionService.generateRandomToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

  const session = await sessionService.createSession(user.id, refreshToken, expiresAt);
  const accessToken = generateAccessToken(user.id, user.email, session.id);

  return { 
    user: { id: user.id, email: user.email }, 
    accessToken, 
    refreshToken 
  };
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const refreshToken = sessionService.generateRandomToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

  const session = await sessionService.createSession(user.id, refreshToken, expiresAt);
  const accessToken = generateAccessToken(user.id, user.email, session.id);

  return { 
    user: { id: user.id, email: user.email }, 
    accessToken, 
    refreshToken 
  };
};

export const refresh = async (oldRefreshToken: string) => {
  const result = await sessionService.findSessionByToken(oldRefreshToken);

  if (!result) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  const { session, type } = result;

  if (type === 'consumed') {
    // REUSE DETECTION: Revoke the entire session as it may have been stolen
    await sessionService.revokeSession(session.id);
    throw new Error('REFRESH_TOKEN_REUSE_DETECTED');
  }

  if (session.revokedAt) {
    throw new Error('SESSION_REVOKED');
  }

  if (new Date() > session.expiresAt) {
    throw new Error('SESSION_EXPIRED');
  }

  // Idle timeout check
  const idleExpiration = new Date(session.lastActivityAt.getTime() + IDLE_TIMEOUT_MINUTES * 60000);
  if (new Date() > idleExpiration) {
    await sessionService.revokeSession(session.id);
    throw new Error('IDLE_TIMEOUT');
  }

  const newRefreshToken = sessionService.generateRandomToken();
  try {
    await sessionService.rotateRefreshToken(session.id, oldRefreshToken, newRefreshToken);
  } catch (error: any) {
    if (error.message === 'SESSION_NOT_FOUND_OR_TOKEN_MISMATCH') {
      // Could happen if another concurrent request already rotated it
      throw new Error('CONCURRENT_REFRESH_ATTEMPT');
    }
    throw error;
  }
  
  const accessToken = generateAccessToken(session.userId, session.user.email, session.id);

  return { 
    accessToken, 
    refreshToken: newRefreshToken 
  };
};
