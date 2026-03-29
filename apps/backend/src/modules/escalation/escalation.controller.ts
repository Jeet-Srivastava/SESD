import { Request, Response } from 'express';
import { EscalationService } from './escalation.service.js';

export class EscalationController {
  constructor(private readonly escalationService: EscalationService) {}

  public runEscalation = async (req: Request, res: Response): Promise<void> => {
    const maxHours = Number(req.body?.maxHours ?? 48);
    const escalatedCount = await this.escalationService.escalateOverdueComplaints(maxHours);
    res.status(200).json({
      success: true,
      data: { escalatedCount, maxHours },
    });
  };
}
