import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { requireAuth, requireRoles } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/roles.js';

const analyticsController = new AnalyticsController(new AnalyticsService());
export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);
analyticsRouter.get(
  '/overview',
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  analyticsController.getOverview,
);
