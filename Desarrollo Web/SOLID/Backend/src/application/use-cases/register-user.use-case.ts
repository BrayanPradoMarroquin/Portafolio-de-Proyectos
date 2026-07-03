import { RegisterDTO } from '../../core/interfaces/auth.interface';
import { IUserRepository } from '../../core/interfaces/user.interface';
import { IEncryptionService } from '../../core/interfaces/auth.interface';
import { User } from '../../core/entities/user.entity';
import { UserRole } from '../../core/enums/role.enum';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(data: RegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.encryptionService.hashPassword(data.password);
    
    const user = User.create(
      data.name,
      data.email,
      hashedPassword,
      data.role || UserRole.CLIENT
    );

    const encryptedName = this.encryptionService.encrypt(user.name);
    const encryptedEmail = this.encryptionService.encrypt(user.email);
    
    const encryptedUser = new User(
      user.id,
      encryptedName,
      encryptedEmail,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt
    );

    return await this.userRepository.create(encryptedUser);
  }
}