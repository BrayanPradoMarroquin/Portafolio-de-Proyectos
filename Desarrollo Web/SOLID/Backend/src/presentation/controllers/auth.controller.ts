import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case';
import { UserRole } from '../../core/enums/role.enum';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      const userRole = role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.CLIENT;
      
      const user = await this.registerUseCase.execute({
        name,
        email,
        password,
        role: userRole
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name,
          email,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });

      res.cookie('auth_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: result.expiresIn * 1000
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          expiresIn: result.expiresIn
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const result = await this.refreshTokenUseCase.execute(token);

      res.cookie('auth_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: result.expiresIn * 1000
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.user,
          expiresIn: result.expiresIn
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
      if (token) {
        await this.logoutUseCase.execute(token);
      }

      res.clearCookie('auth_token');
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  }
}