export interface ITokenBlacklistService {
  blacklistToken(token: string): Promise<void> | void;
  blacklistJti(jti: string): Promise<void> | void;
  isTokenBlacklisted(token: string): Promise<boolean> | boolean;
  isJtiBlacklisted(jti: string): Promise<boolean> | boolean;
}