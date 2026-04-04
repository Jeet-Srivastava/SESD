import { Router } from 'express';
import { HealthController } from './health.controller.js';

const healthController = new HealthController();
export const healthRouter = Router();

healthRouter.get('/', (req, res) => healthController.check(req, res));
