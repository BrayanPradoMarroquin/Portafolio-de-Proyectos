import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../core/enums/role.enum';

export class AuthValidator {
  static validateRegister(req: Request, res: Response, next: NextFunction): void {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
      return;
    }

    if (role && ![UserRole.ADMIN, UserRole.CLIENT].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "admin" or "client"'
      });
      return;
    }

    next();
  }

  static validateLogin(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    next();
  }
}