import bcrypt from 'bcryptjs';
import { AppError } from '../../shared/errors/app-error.js';
import { UserRole } from '../../shared/types/roles.js';
import { UserModel } from '../users/user.model.js';
import { LoginInput, RegisterInput } from './auth.types.js';
import { TokenService } from './token.service.js';

export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  public async register(input: RegisterInput): Promise<{ accessToken: string }> {
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) {
      throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
    }

    if (input.role !== UserRole.STUDENT) {
      throw new AppError(
        'Public registration only supports student accounts',
        403,
        'ROLE_REGISTRATION_FORBIDDEN',
      );
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    const accessToken = this.tokenService.createAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  public async login(input: LoginInput): Promise<{ accessToken: string }> {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    return {
      accessToken: this.tokenService.createAccessToken({
        userId: String(user._id),
        email: user.email,
        role: user.role,
      }),
    };
  }
}
