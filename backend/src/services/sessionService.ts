import crypto from 'crypto';
import prisma from '../utils/prisma';

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const createSession = async (userId: string, refreshToken: string, expiresAt: Date) => {
  const refreshTokenHash = hashToken(refreshToken);
  return await prisma.session.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });
};

export const findSessionByToken = async (refreshToken: string) => {
  const hash = hashToken(refreshToken);
  
  // First check if it's the current active token
  const activeSession = await prisma.session.findUnique({
    where: { refreshTokenHash: hash },
    include: { user: true },
  });

  if (activeSession) return { session: activeSession, type: 'active' as const };

  // Then check if it was previously consumed
  const consumedSession = await prisma.session.findFirst({
    where: { consumedHashes: { has: hash } },
    include: { user: true },
  });

  if (consumedSession) return { session: consumedSession, type: 'consumed' as const };

  return null;
};

export const updateSessionActivity = async (sessionId: string) => {
  const now = new Date();
  const THROTTLE_MS = 60 * 1000; // 1 minute throttling

  return await prisma.$transaction(async (tx) => {
    const session = await tx.session.findUnique({
      where: { id: sessionId },
      select: { lastActivityAt: true }
    });

    if (session && (now.getTime() - session.lastActivityAt.getTime() > THROTTLE_MS)) {
      return await tx.session.update({
        where: { id: sessionId },
        data: { lastActivityAt: now },
      });
    }
    return session;
  });
};

export const rotateRefreshToken = async (sessionId: string, oldToken: string, newToken: string) => {
  const oldHash = hashToken(oldToken);
  const newHash = hashToken(newToken);

  return await prisma.$transaction(async (tx) => {
    const session = await tx.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.refreshTokenHash !== oldHash) {
      throw new Error('SESSION_NOT_FOUND_OR_TOKEN_MISMATCH');
    }

    if (session.revokedAt) {
      throw new Error('SESSION_REVOKED');
    }

    return await tx.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: newHash,
        consumedHashes: {
          push: oldHash
        },
        lastActivityAt: new Date(),
      },
    });
  });
};

export const revokeSession = async (sessionId: string) => {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllUserSessions = async (userId: string) => {
  return await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const getActiveSessions = async (userId: string) => {
  return await prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      createdAt: true,
      lastActivityAt: true,
      expiresAt: true,
    },
  });
};
