export class Token {
  constructor(
    public jti: string,
    public token: string,
    public expiresAt: Date,
    public userId: string,
    public createdAt: Date = new Date()
  ) {}

  static create(
    token: string,
    expiresAt: Date,
    userId: string
  ): Token {
    const jti = Math.random().toString(36).substr(2, 9);
    return new Token(jti, token, expiresAt, userId);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canRefresh(refreshWindowMs: number): boolean {
    const now = new Date();
    const expirationTime = this.expiresAt.getTime();
    const refreshLimit = expirationTime + refreshWindowMs;
    return now.getTime() <= refreshLimit;
  }
}