import { UserRole } from '../../shared/types/roles.js';

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}
