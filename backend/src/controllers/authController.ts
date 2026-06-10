import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      data: result,
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
    return res.status(200).json({
      success: true,
      data: result,
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
