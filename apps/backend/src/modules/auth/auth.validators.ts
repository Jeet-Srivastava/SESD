import { z } from 'zod';
import { UserRole } from '../../shared/types/roles.js';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
