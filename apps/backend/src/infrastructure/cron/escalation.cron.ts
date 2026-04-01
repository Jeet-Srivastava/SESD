import { EscalationService } from '../../modules/escalation/escalation.service.js';
import { NotificationService } from '../../modules/notifications/notification.service.js';
import { logger } from '../../config/logger.js';

export class EscalationCron {
  private timer: NodeJS.Timeout | null = null;
  private readonly escalationService: EscalationService;

  constructor() {
    this.escalationService = new EscalationService(new NotificationService());
  }

  public start() {
    const intervalMs = 60 * 60 * 1000;
    
    this.timer = setInterval(async () => {
      try {
        logger.info('[CRON] Starting SLA check...');
        const count = await this.escalationService.escalateOverdueComplaints(48);
        logger.info(`[CRON] SLA check complete. ${count} complaints escalated.`);
      } catch (error) {
        logger.error('[CRON] SLA check failed.', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }, intervalMs);

    logger.info('[CRON] Escalation SLA job started (runs every 1 hour)');
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
