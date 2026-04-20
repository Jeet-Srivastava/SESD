import cors from 'cors';
import express from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { complaintRouter } from './modules/complaints/complaint.routes.js';
import { escalationRouter } from './modules/escalation/escalation.routes.js';
import { analyticsRouter } from './modules/analytics/analytics.routes.js';
import { uploadRouter } from './modules/upload/upload.routes.js';
import { userRouter } from './modules/users/user.routes.js';
import { env } from './config/env.js';
import { requestLogger } from './shared/middleware/request-logger.js';
import { errorHandler } from './shared/middleware/error-handler.js';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(requestLogger);

  app.get('/', (_req, res) => {
    res.json({ success: true, data: { service: 'SESD Smart Campus CMS API' } });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/complaints', complaintRouter);
  app.use('/api/escalation', escalationRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/users', userRouter);
  app.use(errorHandler);
  return app;
};
