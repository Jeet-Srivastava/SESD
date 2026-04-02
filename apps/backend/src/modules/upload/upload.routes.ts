import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { UploadController } from './upload.controller.js';

const uploadController = new UploadController();

export const uploadRouter = Router();

// bas logged-in users upload kar sakte hain
uploadRouter.use(requireAuth);
uploadRouter.post('/image', uploadController.uploadImage);
