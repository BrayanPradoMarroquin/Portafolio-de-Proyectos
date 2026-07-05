import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../core/enums/role.enum';

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        throw new Error('User not found in request');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new Error('Insufficient permissions');
      }

      next();
    } catch (error: any) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: error.message
      });
    }
  };
}