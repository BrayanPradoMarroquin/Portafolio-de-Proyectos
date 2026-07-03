import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthValidator } from '../validators/auth.validator';
import { authMiddlewareFactory } from '../../infrastructure/middlewares/auth.middleware';
import { roleMiddleware } from '../../infrastructure/middlewares/role.middleware';
import { UserRole } from '../../core/enums/role.enum';
import { IJwtService } from '../../core/interfaces/auth.interface';
import { ITokenBlacklistService } from '../../core/interfaces/token.interface';

export function createAuthRoutes(
  authController: AuthController,
  jwtService: IJwtService,
  tokenBlacklistService: ITokenBlacklistService 
): Router {
  const router = Router();
  
  // Crear el authMiddleware con las dependencias
  const authMiddleware = authMiddlewareFactory(jwtService, tokenBlacklistService);

  // Public routes con validación
  router.post('/register', 
    AuthValidator.validateRegister, 
    authController.register.bind(authController)
  );
  
  router.post('/login', 
    AuthValidator.validateLogin, 
    authController.login.bind(authController)
  );

  // Protected routes
  router.post('/refresh', authController.refreshToken.bind(authController));
  
  router.post('/logout', 
    (req, res, next) => {
      // Verificar si hay token
      const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }
      next();
    },
    authController.logout.bind(authController)
  );
  
  router.get('/verify', authMiddleware, authController.verify.bind(authController));

  // Role-based routes
  router.get('/admin-only', 
    authMiddleware, 
    roleMiddleware([UserRole.ADMIN]), 
    (req, res) => {
      res.json({
        success: true,
        message: 'Welcome Admin! This route is for admins only.'
      });
    }
  );

  router.get('/client-dashboard', 
    authMiddleware, 
    roleMiddleware([UserRole.ADMIN, UserRole.CLIENT]), 
    (req, res) => {
      res.json({
        success: true,
        message: 'Welcome! This route is for both admins and clients.'
      });
    }
  );

  return router;
}