import { UserRole } from '../enums/role.enum';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  jti: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
  expiresIn: number;
}

export interface IEncryptionService {
  encrypt(text: string): string;
  decrypt(encryptedText: string): string;
  compare(plainText: string, encryptedText: string): boolean;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

export interface IJwtService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
  decodeToken(token: string): TokenPayload | null;
}