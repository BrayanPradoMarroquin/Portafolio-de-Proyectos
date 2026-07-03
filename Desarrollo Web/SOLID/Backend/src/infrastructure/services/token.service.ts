import { Token } from '../../core/entities/token.entity';
import { ITokenRepository } from '../../infrastructure/repositories/mysql-token.repository';

export class TokenService {
  constructor(private readonly tokenRepository: ITokenRepository) {}

  async createToken(token: string, expiresAt: Date, userId: string): Promise<Token> {
    const jti = Math.random().toString(36).substr(2, 9);
    const tokenEntity = Token.create(token, expiresAt, userId);
    
    await this.tokenRepository.create(tokenEntity);
    return tokenEntity;
  }

  async blacklistToken(jti: string): Promise<void> {
    await this.tokenRepository.blacklistToken(jti);
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    return await this.tokenRepository.isTokenBlacklisted(jti);
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.deleteExpiredTokens();
  }
}