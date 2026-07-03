import { IJwtService, TokenPayload } from '../../core/interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';

export class JwtService implements IJwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string | number
  ) {}

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}