import { Types } from 'mongoose';
import { AppError } from '../../shared/errors/app-error.js';
import { ComplaintPriority, ComplaintStatus, UserRole } from '../../shared/types/roles.js';
import { AiService } from '../ai/ai.service.js';
import { ComplaintModel } from './complaint.model.js';
import { ComplaintStateMachine } from './complaint.state.js';
import { UserModel } from '../users/user.model.js';
import { NotificationService } from '../notifications/notification.service.js';
import { AuthPayload } from '../auth/auth.types.js';

interface CreateComplaintInput {
  title: string;
  description: string;
  category?: string;
  imageUrls: string[];
  authorId: string;
}

export class ComplaintService {
  private readonly stateMachine = new ComplaintStateMachine();

  constructor(
    private readonly aiService: AiService,
    private readonly notificationService: NotificationService,
  ) {}

  public async create(input: CreateComplaintInput) {
    const aiCategory = await this.aiService.classify(input.title, input.description);
    const aiPriority = await this.aiService.detectPriority(input.title, input.description);

    const complaint = await ComplaintModel.create({
      title: input.title,
      description: input.description,
      category: input.category ?? aiCategory.category,
      priority: aiPriority as ComplaintPriority,
      imageUrls: input.imageUrls,
      aiHints: aiCategory.hint,
      authorId: new Types.ObjectId(input.authorId),
    });

    await this.notifyAuthor(String(complaint.authorId), async (recipientEmail) => {
      await this.notificationService.sendComplaintCreated(recipientEmail, String(complaint._id));
    });

    return complaint;
  }

  public async updateStatus(complaintId: string, nextStatus: ComplaintStatus) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
    }

    this.stateMachine.ensureTransition(complaint.status, nextStatus);
    complaint.status = nextStatus;

    if (nextStatus === ComplaintStatus.RESOLVED) complaint.resolvedAt = new Date();
    if (nextStatus === ComplaintStatus.CLOSED) complaint.closedAt = new Date();

    await complaint.save();

    await this.notifyAuthor(String(complaint.authorId), async (recipientEmail) => {
      await this.notificationService.sendStatusUpdate(
        recipientEmail,
        String(complaint._id),
        nextStatus,
      );
    });

    return complaint;
  }

  public async assign(complaintId: string, assigneeId: string) {
    const staffUser = await UserModel.findById(assigneeId);
    if (!staffUser || staffUser.role !== UserRole.STAFF) {
      throw new AppError('Assignee must be staff user', 400, 'INVALID_ASSIGNEE');
    }

    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
    }

    this.stateMachine.ensureTransition(complaint.status, ComplaintStatus.ASSIGNED);
    complaint.status = ComplaintStatus.ASSIGNED;
    complaint.assigneeId = new Types.ObjectId(assigneeId);
    complaint.assignedAt = new Date();

    await complaint.save();
    
    await this.notifyAuthor(String(complaint.authorId), async (recipientEmail) => {
      await this.notificationService.sendStatusUpdate(
        recipientEmail,
        String(complaint._id),
        ComplaintStatus.ASSIGNED,
      );
    });

    return complaint;
  }

  public async addComment(complaintId: string, auth: AuthPayload, message: string) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw new AppError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');

    this.ensureComplaintAccess(complaint.authorId, auth);

    complaint.comments.push({
      message,
      authorId: new Types.ObjectId(auth.userId),
      createdAt: new Date(),
    });

    await complaint.save();

    await this.notifyAuthor(String(complaint.authorId), async (recipientEmail) => {
      await this.notificationService.sendStatusUpdate(
        recipientEmail,
        String(complaint._id),
        'NEW_COMMENT',
      );
    });

    return complaint;
  }

  public async addResolutionNote(complaintId: string, _staffId: string, note: string) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw new AppError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');

    complaint.resolutionNote = note;
    this.stateMachine.ensureTransition(complaint.status, ComplaintStatus.RESOLVED);
    complaint.status = ComplaintStatus.RESOLVED;
    complaint.resolvedAt = new Date();

    await complaint.save();

    await this.notifyAuthor(String(complaint.authorId), async (recipientEmail) => {
      await this.notificationService.sendStatusUpdate(
        recipientEmail,
        String(complaint._id),
        ComplaintStatus.RESOLVED,
      );
    });
    
    return complaint;
  }

  public async findSimilar(title: string, description: string) {
    const keywords = this.extractSimilarityKeywords(title, description);
    if (keywords.length === 0) return [];

    const keywordPattern = keywords.map((keyword) => this.escapeRegex(keyword)).join('|');

    const complaints = await ComplaintModel.find({
      $or: [
        { title: { $regex: keywordPattern, $options: 'i' } },
        { description: { $regex: keywordPattern, $options: 'i' } },
      ],
      status: { $nin: [ComplaintStatus.CLOSED, ComplaintStatus.RESOLVED] },
    })
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .limit(3);

    return complaints;
  }

  public async getMyComplaints(authorId: string) {
    return ComplaintModel.find({ authorId: new Types.ObjectId(authorId) })
      .sort({ createdAt: -1 })
      .select('title category status priority createdAt escalationLevel resolutionNote aiHints');
  }

  public async getAllComplaints() {
    return ComplaintModel.find()
      .sort({ priority: 1, createdAt: -1 })
      .populate('authorId', 'name email role')
      .select('-__v');
  }

  public async getComplaintById(complaintId: string, auth: AuthPayload) {
    const complaint = await ComplaintModel.findById(complaintId)
      .populate('authorId', 'name')
      .populate('assigneeId', 'name email role')
      .populate('comments.authorId', 'name role');

    if (!complaint) {
      return null;
    }

    this.ensureComplaintAccess(complaint.authorId?._id ?? complaint.authorId, auth);

    return complaint;
  }

  private ensureComplaintAccess(
    authorId: Types.ObjectId | string | { _id?: Types.ObjectId | string },
    auth: AuthPayload,
  ): void {
    if (auth.role === UserRole.ADMIN || auth.role === UserRole.STAFF) {
      return;
    }

    const normalizedAuthorId =
      typeof authorId === 'object' && authorId !== null && '_id' in authorId
        ? String(authorId._id)
        : String(authorId);

    if (normalizedAuthorId !== auth.userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }
  }

  private extractSimilarityKeywords(title: string, description: string): string[] {
    const combinedText = `${title} ${description}`.toLowerCase();
    const tokens = combinedText.match(/[a-z0-9]+/g) ?? [];

    return [...new Set(tokens.filter((token) => token.length > 3))].slice(0, 8);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async notifyAuthor(
    authorId: string,
    handler: (recipientEmail: string) => Promise<void>,
  ): Promise<void> {
    const author = await UserModel.findById(authorId).select('email').lean();
    if (!author?.email) {
      return;
    }

    await handler(author.email);
  }
}
