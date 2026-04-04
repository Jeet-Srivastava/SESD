import { Request, Response } from 'express';

export class HealthController {
  public check(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      data: {
        service: 'backend',
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
