import { ITokenBlacklistService } from '../../core/interfaces/token.interface';
import { MySQLTokenRepository } from '../repositories/mysql-token.repository';

export class MySQLTokenBlacklistService implements ITokenBlacklistService {
  constructor(private readonly tokenRepository: MySQLTokenRepository) {}

  async blacklistToken(token: string): Promise<void> {
    try {
      const tokenData = await this.tokenRepository.findByToken(token);
      if (tokenData) {
        await this.tokenRepository.blacklistToken(tokenData.jti);
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  async blacklistJti(jti: string): Promise<void> {
    try {
      await this.tokenRepository.blacklistToken(jti);
    } catch (error) {
      console.error('Error blacklisting jti:', error);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenData = await this.tokenRepository.findByToken(token);
      if (!tokenData) return false;
      
      return await this.tokenRepository.isTokenBlacklisted(tokenData.jti);
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false;
    }
  }

  async isJtiBlacklisted(jti: string): Promise<boolean> {
    try {
      return await this.tokenRepository.isTokenBlacklisted(jti);
    } catch (error) {
      console.error('Error checking jti blacklist:', error);
      return false;
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.tokenRepository.deleteExpiredTokens();
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
    }
  }
}