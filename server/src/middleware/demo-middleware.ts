import { Request, Response, NextFunction } from 'express';

/**
 * Demo middleware — bypasses authentication for demo/showcase purposes.
 * Sets `req.user` as admin so all admin-protected routes work without a real token.
 *
 * Revert: remove this file and restore `authMiddleware + adminMiddleware` in routes.
 */
export function demoMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.user = {
    userId: 1,  // Admin user created by setup.ts
    role: 'admin',
  };
  next();
}
