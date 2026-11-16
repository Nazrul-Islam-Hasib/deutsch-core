import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import * as sessionService from '../services/sessionService';

const JWT_SECRET = process.env['JWT_SECRET'];
const IDLE_TIMEOUT_MINUTES = 30;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    sessionId: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Unauthorized: No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; sessionId: string };
    
    // Validate session in database
    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: Session not found',
      });
    }

    if (session.revokedAt) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: Session revoked',
      });
    }

    // Check if user is still active (optional: add status field to User model later if needed)
    if (!session.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: User not found',
      });
    }

    const now = new Date();
    if (now > session.expiresAt) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: Session expired',
      });
    }

    // Idle timeout check
    const idleExpiration = new Date(session.lastActivityAt.getTime() + IDLE_TIMEOUT_MINUTES * 60000);
    if (now > idleExpiration) {
      await sessionService.revokeSession(session.id);
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: Idle timeout',
      });
    }

    // Update last activity with throttling
    await sessionService.updateSessionActivity(session.id);

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Unauthorized: Invalid or expired token',
    });
  }
};
