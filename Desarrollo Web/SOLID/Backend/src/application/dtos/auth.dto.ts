import { UserRole } from '../../core/enums/role.enum';

export class RegisterDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = UserRole.CLIENT
  ) {}
}

export class LoginDTO {
  constructor(
    public email: string,
    public password: string
  ) {}
}

export class AuthResponseDTO {
  constructor(
    public success: boolean,
    public message: string,
    public data?: any
  ) {}
}