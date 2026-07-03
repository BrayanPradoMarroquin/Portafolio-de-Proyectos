import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { environment, JWT_CONFIG } from './config/environment';
import { createAuthRoutes } from './presentation/routes/auth.routes';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { EncryptionService } from './infrastructure/services/encryption.service';
import { JwtService } from './infrastructure/services/jwt.service';
import { MySQLConnection } from './infrastructure/database/mysql.connection';
import { MySQLUserRepository } from './infrastructure/repositories/mysql-user.repository';
import { MySQLTokenRepository } from './infrastructure/repositories/mysql-token.repository';
import { MySQLTokenBlacklistService } from './infrastructure/services/mysql-token-blacklist.service';
import { ITokenBlacklistService } from './core/interfaces/token.interface';
import { TokenService } from './infrastructure/services/token.service';

// Initialize database connection
MySQLConnection.initialize();

// Initialize services
const userRepository = new MySQLUserRepository();
const tokenRepository = new MySQLTokenRepository();
const encryptionService = new EncryptionService(environment.encryptionKey);
const jwtService = new JwtService(JWT_CONFIG.SECRET, JWT_CONFIG.EXPIRES_IN);
const tokenService = new TokenService(tokenRepository);
const tokenBlacklistService: ITokenBlacklistService = new MySQLTokenBlacklistService(tokenRepository);

// Initialize use cases
const registerUseCase = new RegisterUserUseCase(userRepository, encryptionService);
const loginUseCase = new LoginUserUseCase(
  userRepository,
  encryptionService,
  jwtService,
  JWT_CONFIG.EXPIRATION_MS,
  tokenRepository

);
const refreshTokenUseCase = new RefreshTokenUseCase(
  userRepository,
  jwtService,
  tokenBlacklistService,
  JWT_CONFIG.EXPIRATION_MS,
  JWT_CONFIG.REFRESH_WINDOW_MS
);
const logoutUseCase = new LogoutUserUseCase(
  jwtService,
  tokenBlacklistService
);

// Initialize controller
const authController = new AuthController(
  registerUseCase,
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase
);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: environment.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', createAuthRoutes(authController, jwtService, tokenBlacklistService));

// Health check con verificación de base de datos
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a MySQL
    await MySQLConnection.executeQuery('SELECT 1 as status');
    
    res.json({ 
      status: 'OK',
      service: 'auth-backend',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      service: 'auth-backend',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Demo route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend de Práctica 2 - Autenticación JWT con MySQL',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify',
        refresh: 'POST /api/auth/refresh',
        admin_only: 'GET /api/auth/admin-only',
        client_dashboard: 'GET /api/auth/client-dashboard'
      },
      system: {
        health: 'GET /health'
      }
    }
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await MySQLConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await MySQLConnection.close();
  process.exit(0);
});

// Start server
app.listen(environment.port, () => {
  console.log(`🚀 Server running on port ${environment.port}`);
  console.log(`📁 Environment: ${environment.nodeEnv}`);
  console.log(`🗄️  Database: MySQL (${environment.database.host}:${environment.database.port})`);
  console.log(`🔐 JWT Expires In: ${JWT_CONFIG.EXPIRES_IN}`);
  console.log(`🌐 URL: http://localhost:${environment.port}`);
});