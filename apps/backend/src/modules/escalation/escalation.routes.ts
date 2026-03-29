import { Router } from 'express';
import { EscalationController } from './escalation.controller.js';
import { EscalationService } from './escalation.service.js';
import { NotificationService } from '../notifications/notification.service.js';
import { requireAuth, requireRoles } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/roles.js';

const escalationController = new EscalationController(new EscalationService(new NotificationService()));
export const escalationRouter = Router();

escalationRouter.use(requireAuth);
escalationRouter.post(
  '/run',
  requireRoles(UserRole.ADMIN),
  escalationController.runEscalation,
);
