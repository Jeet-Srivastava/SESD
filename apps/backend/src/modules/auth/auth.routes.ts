import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TokenService } from './token.service.js';
import { requireAuth, requireRoles } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/roles.js';

const authController = new AuthController(new AuthService(new TokenService()));
export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', requireAuth, authController.me);
authRouter.get(
  '/staff-admin-check',
  requireAuth,
  requireRoles(UserRole.STAFF, UserRole.ADMIN),
  authController.staffOrAdminCheck,
);
