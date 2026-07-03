export const environment = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshWindow: parseInt(process.env.JWT_REFRESH_WINDOW || '300000', 10), // 5 minutes
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

    // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'hamllelo',
    name: process.env.DB_NAME || 'practica2_auth'
  }
};

export const JWT_CONFIG = {
  SECRET: environment.jwtSecret,
  EXPIRES_IN: environment.jwtExpiresIn,
  EXPIRATION_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
  REFRESH_WINDOW_MS: environment.jwtRefreshWindow
};

