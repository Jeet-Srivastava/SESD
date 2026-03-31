import { logger } from '../../config/logger.js';

export interface INotificationChannel {
  send(recipient: string, subject: string, message: string): Promise<void>;
}

class MockEmailChannel implements INotificationChannel {
  public async send(recipient: string, subject: string, message: string): Promise<void> {
    logger.info(`[MOCK EMAIL to ${recipient}] Subject: ${subject} | Body: ${message}`);
  }
}

export class NotificationService {
  constructor(private readonly channel: INotificationChannel = new MockEmailChannel()) {}

  public async sendComplaintCreated(recipient: string, complaintId: string): Promise<void> {
    const subject = `Complaint Received: #${complaintId}`;
    const message = `Your complaint (#${complaintId}) was registered successfully.`;
    await this.channel.send(recipient, subject, message);
  }

  public async sendStatusUpdate(recipient: string, complaintId: string, status: string): Promise<void> {
    const subject = `Update on Complaint #${complaintId}`;
    const message = `Your complaint status is now '${status}'.`;
    await this.channel.send(recipient, subject, message);
  }

  public async sendEscalationAlert(adminEmail: string, complaintId: string): Promise<void> {
    const subject = `[URGENT] Complaint #${complaintId} Escalated`;
    const message = `Complaint breaching SLA limits. Please check dashboard.`;
    await this.channel.send(adminEmail, subject, message);
  }
}
