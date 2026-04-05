import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  public getOverview = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.analyticsService.overview();
    res.status(200).json({ success: true, data });
  };
}
