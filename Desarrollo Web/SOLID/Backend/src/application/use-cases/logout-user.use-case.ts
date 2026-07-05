import { IJwtService } from '../../core/interfaces/auth.interface';
import { ITokenBlacklistService } from '../../core/interfaces/token.interface';

export class LogoutUserUseCase {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly tokenBlacklistService: ITokenBlacklistService  // Cambiar tipo aquí
  ) {}

  async execute(token: string): Promise<void> {
    const decoded = this.jwtService.decodeToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    await this.tokenBlacklistService.blacklistToken(token);
    await this.tokenBlacklistService.blacklistJti(decoded.jti);
  }
}