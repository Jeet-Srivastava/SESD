import { Request, Response } from 'express';
import { AppError } from '../../shared/errors/app-error.js';

export class UploadController {
  public uploadImage = async (req: Request, res: Response): Promise<void> => {
    if (!req.body || !req.body.image) {
      throw new AppError('Image payload is required', 400, 'NO_IMAGE_PROVIDED');
    }

    const mockUrl = `https://cdn.smartcampus.mock/uploads/${Date.now()}.png`;

    res.status(200).json({ success: true, data: { url: mockUrl } });
  };
}
