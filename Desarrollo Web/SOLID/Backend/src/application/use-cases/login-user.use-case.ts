import { LoginDTO, AuthResponse, TokenPayload } from '../../core/interfaces/auth.interface';
import { IUserRepository } from '../../core/interfaces/user.interface';
import { IEncryptionService, IJwtService } from '../../core/interfaces/auth.interface';
import { Token } from '../../core/entities/token.entity';
import { User } from '../../core/entities/user.entity';
import { ITokenRepository } from '../../infrastructure/repositories/mysql-token.repository'; 

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtService: IJwtService,
    private readonly tokenExpirationMs: number,
    private readonly tokenRepository?: ITokenRepository
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponse> {
    
    const users = await this.userRepository.findAll();
    let user: User | null = null;
    
    // Buscar usuario usando compare
    for (const u of users) {
      try {
        if (this.encryptionService.compare(data.email, u.email)) {
          user = u;
          break;
        }
      } catch (error) {
        console.error(`Error comparing email for user ${u.id}:`, error);
        continue;
      }
    }

    if (!user) {
      console.log('User not found with email:', data.email);
      throw new Error('Invalid credentials');
    }

    // Verificar contraseña
    const isValidPassword = await this.encryptionService.comparePassword(
      data.password,
      user.password
    );

    if (!isValidPassword) {
      console.log('Invalid password for user:', user.id);
      throw new Error('Invalid credentials');
    }

    // Generar token
    const jti = Math.random().toString(36).substr(2, 9);
    const expiresAt = new Date(Date.now() + this.tokenExpirationMs);

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      jti
    };

    const accessToken = this.jwtService.generateToken(payload);
    
    // Crear y guardar token en la base de datos
    const tokenEntity = Token.create(accessToken, expiresAt, user.id);
    
    if (this.tokenRepository) {
      try {
        await this.tokenRepository.create(tokenEntity);
      } catch (error) {
        console.error('Error saving token to database:', error);
        // Continuar aunque falle la guardada del token
      }
    } else {
      console.log('Token repository not available, token not saved to DB');
    }

    // Desencriptar datos para la respuesta
    let decryptedName: string;
    let decryptedEmail: string;
    
    try {
      decryptedName = this.encryptionService.decrypt(user.name);
      decryptedEmail = this.encryptionService.decrypt(user.email);
    } catch (error) {
      console.error('Error decrypting user data:', error);
      // Si falla la desencriptación, usar valores por defecto
      decryptedName = 'Usuario';
      decryptedEmail = user.email;
    }
    
    return {
      user: {
        id: user.id,
        name: decryptedName,
        email: decryptedEmail,
        role: user.role
      },
      accessToken,
      expiresIn: this.tokenExpirationMs / 1000
    };
  }
}