import { ComplaintModel } from '../complaints/complaint.model.js';
import { ComplaintStatus } from '../../shared/types/roles.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserModel } from '../users/user.model.js';
import { UserRole } from '../../shared/types/roles.js';

export class EscalationService {
  constructor(private readonly notificationService: NotificationService) {}

  public async escalateOverdueComplaints(maxHours = 48): Promise<number> {
    const thresholdDate = new Date(Date.now() - maxHours * 60 * 60 * 1000);
    const adminUsers = await UserModel.find({ role: UserRole.ADMIN }).select('email').lean();
    const overdueComplaints = await ComplaintModel.find({
      status: { $in: [ComplaintStatus.CREATED, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS] },
      createdAt: { $lt: thresholdDate },
    });

    for (const complaint of overdueComplaints) {
      complaint.status = ComplaintStatus.ESCALATED;
      complaint.escalationLevel += 1;
      await complaint.save();

      await Promise.all(
        adminUsers
          .map((adminUser) => adminUser.email)
          .filter((email): email is string => Boolean(email))
          .map((email) =>
            this.notificationService.sendEscalationAlert(email, String(complaint._id)),
          ),
      );
    }

    return overdueComplaints.length;
  }
}
