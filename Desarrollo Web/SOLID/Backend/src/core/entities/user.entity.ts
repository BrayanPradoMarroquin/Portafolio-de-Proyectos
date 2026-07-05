import { UserRole } from '../enums/role.enum';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): User {
    const id = Math.random().toString(36).substr(2, 9);
    return new User(id, name, email, password, role);
  }

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }
}