import { ITokenBlacklistService } from '../../core/interfaces/token.interface';

export class TokenBlacklistService implements ITokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();
  private blacklistedJtis: Set<string> = new Set();

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  blacklistJti(jti: string): void {
    this.blacklistedJtis.add(jti);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  isJtiBlacklisted(jti: string): boolean {
    return this.blacklistedJtis.has(jti);
  }
}