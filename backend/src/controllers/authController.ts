import { Request, Response } from 'express';
import * as authService from '../services/authService';
import * as sessionService from '../services/sessionService';
import { AuthRequest } from '../middlewares/authMiddleware';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true, // Required for SameSite=None
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site prod, 'lax' for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    return res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
      error: null,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'EMAIL_ALREADY_EXISTS: A user with this email already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
      error: null,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password',
      });
    }
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!oldRefreshToken) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'No refresh token provided',
    });
  }

  try {
    const result = await authService.refresh(oldRefreshToken);
    setRefreshTokenCookie(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
      error: null,
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return res.status(401).json({
      success: false,
      data: null,
      error: error.message || 'Invalid refresh token',
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.sessionId) {
      await sessionService.revokeSession(req.user.sessionId);
    }
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return res.status(200).json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.id) {
      await sessionService.revokeAllUserSessions(req.user.id);
    }
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return res.status(200).json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: req.user,
    error: null,
  });
};

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const sessions = await sessionService.getActiveSessions(req.user.id);
    return res.status(200).json({
      success: true,
      data: sessions,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal Server Error',
    });
  }
};
