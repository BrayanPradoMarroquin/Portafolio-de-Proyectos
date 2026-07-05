import { AuthResponse, TokenPayload } from '../../core/interfaces/auth.interface';
import { IUserRepository } from '../../core/interfaces/user.interface';
import { IJwtService } from '../../core/interfaces/auth.interface';
import { ITokenBlacklistService } from '../../core/interfaces/token.interface';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly tokenBlacklistService: ITokenBlacklistService, 
    private readonly tokenExpirationMs: number,
    private readonly refreshWindowMs: number
  ) {}

  async execute(oldToken: string): Promise<AuthResponse> {
    const decoded = this.jwtService.decodeToken(oldToken);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const isBlacklisted = await this.tokenBlacklistService.isJtiBlacklisted(decoded.jti);
    if (isBlacklisted) {
      throw new Error('Token is blacklisted');
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newJti = Math.random().toString(36).substr(2, 9);

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      jti: newJti
    };

    const newToken = this.jwtService.generateToken(payload);
    
    await this.tokenBlacklistService.blacklistJti(decoded.jti);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken: newToken,
      expiresIn: this.tokenExpirationMs / 1000
    };
  }
}