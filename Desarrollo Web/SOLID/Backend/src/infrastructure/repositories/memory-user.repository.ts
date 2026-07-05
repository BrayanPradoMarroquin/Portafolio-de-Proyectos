import { IUserRepository, CreateUserDTO } from '../../core/interfaces/user.interface';
import { User } from '../../core/entities/user.entity';

export class MemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser = new User(
      user.id,
      updates.name || user.name,
      updates.email || user.email,
      updates.password || user.password,
      updates.role || user.role,
      user.createdAt,
      new Date()
    );

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}