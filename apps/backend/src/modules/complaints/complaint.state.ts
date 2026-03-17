import { AppError } from '../../shared/errors/app-error.js';
import { ComplaintStatus } from '../../shared/types/roles.js';

export class ComplaintStateMachine {
  private readonly transitions: Record<ComplaintStatus, ComplaintStatus[]> = {
    [ComplaintStatus.CREATED]: [ComplaintStatus.ASSIGNED, ComplaintStatus.ESCALATED],
    [ComplaintStatus.ASSIGNED]: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.ESCALATED],
    [ComplaintStatus.IN_PROGRESS]: [ComplaintStatus.RESOLVED, ComplaintStatus.ESCALATED],
    [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED, ComplaintStatus.ESCALATED],
    [ComplaintStatus.CLOSED]: [],
    [ComplaintStatus.ESCALATED]: [ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED],
  };

  public ensureTransition(current: ComplaintStatus, next: ComplaintStatus): void {
    if (!this.transitions[current].includes(next)) {
      throw new AppError(`Invalid transition ${current} -> ${next}`, 400, 'INVALID_STATE_TRANSITION');
    }
  }
}
