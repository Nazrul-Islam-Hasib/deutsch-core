import { Request, Response, NextFunction } from 'express';

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Only protect state-changing requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Check for custom header to prevent CSRF in SPA-API setups
  // This is effective because of CORS preflight checks for custom headers.
  const csrfHeader = req.headers['x-requested-with'];
  
  // Also common to use a custom header like 'X-CSRF-Token'
  // For now, we'll enforce 'X-Requested-With' as a simple yet effective measure
  // or a more specific one.
  const customCsrfToken = req.headers['x-csrf-token'];

  if (!csrfHeader && !customCsrfToken) {
    return res.status(403).json({
      success: false,
      data: null,
      error: 'CSRF protection: Missing required security headers',
    });
  }

  next();
};
