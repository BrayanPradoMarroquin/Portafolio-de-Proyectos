import { Request, Response, NextFunction } from 'express';
import { IJwtService } from '../../core/interfaces/auth.interface';
import { ITokenBlacklistService } from '../../core/interfaces/token.interface';

export function authMiddlewareFactory(
  jwtService: IJwtService,
  tokenBlacklistService: ITokenBlacklistService  // Cambiar tipo aquí
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.auth_token || 
                   req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('No token provided');
      }

      const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }

      const payload = jwtService.verifyToken(token);
      if (!payload) {
        throw new Error('Invalid token');
      }

      (req as any).user = payload;
      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: error.message
      });
    }
  };
}