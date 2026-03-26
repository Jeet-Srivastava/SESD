import { Router } from 'express';
import { AiService } from '../ai/ai.service.js';
import { NotificationService } from '../notifications/notification.service.js';
import { ComplaintController } from './complaint.controller.js';
import { ComplaintService } from './complaint.service.js';
import { requireAuth, requireRoles } from '../../shared/middleware/auth.middleware.js';
import { UserRole } from '../../shared/types/roles.js';

const complaintController = new ComplaintController(
  new ComplaintService(new AiService(), new NotificationService()),
);

export const complaintRouter = Router();
complaintRouter.use(requireAuth);

complaintRouter.get('/', requireRoles(UserRole.STUDENT), complaintController.getMyComplaints);
complaintRouter.get('/all', requireRoles(UserRole.ADMIN, UserRole.STAFF), complaintController.getAllComplaints);
complaintRouter.post('/check-similar', requireRoles(UserRole.STUDENT), complaintController.checkSimilar);
complaintRouter.post('/', requireRoles(UserRole.STUDENT), complaintController.create);
complaintRouter.get('/:complaintId', complaintController.getById);
complaintRouter.patch(
  '/:complaintId/status',
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  complaintController.updateStatus,
);
complaintRouter.patch(
  '/:complaintId/assign',
  requireRoles(UserRole.ADMIN),
  complaintController.assign,
);
complaintRouter.post(
  '/:complaintId/comments',
  complaintController.addComment,
);
complaintRouter.patch(
  '/:complaintId/resolve',
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  complaintController.addResolutionNote,
);
