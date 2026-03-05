import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { requireAuth, requireRoles } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/roles.js';

const userController = new UserController(new UserService());
export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get(
  '/staff',
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  userController.getStaffUsers,
);
