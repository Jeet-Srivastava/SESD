import { Request, Response } from 'express';
import { AppError } from '../../shared/errors/app-error.js';
import { ComplaintStatus } from '../../shared/types/roles.js';
import { ComplaintService } from './complaint.service.js';
import { 
  assignComplaintSchema, 
  createComplaintSchema, 
  statusUpdateSchema,
  addCommentSchema,
  addResolutionNoteSchema 
} from './complaint.validators.js';

export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  private getComplaintId(req: Request): string {
    return String(req.params.complaintId);
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const payload = createComplaintSchema.parse(req.body);
    const complaint = await this.complaintService.create({
      ...payload,
      authorId: req.auth.userId,
    });
    res.status(201).json({ success: true, data: complaint });
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = statusUpdateSchema.parse(req.body);
    const complaint = await this.complaintService.updateStatus(
      this.getComplaintId(req),
      status as ComplaintStatus,
    );
    res.status(200).json({ success: true, data: complaint });
  };

  public assign = async (req: Request, res: Response): Promise<void> => {
    const { assigneeId } = assignComplaintSchema.parse(req.body);
    const complaint = await this.complaintService.assign(this.getComplaintId(req), assigneeId);
    res.status(200).json({ success: true, data: complaint });
  };

  public addComment = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { message } = addCommentSchema.parse(req.body);
    const complaint = await this.complaintService.addComment(
      this.getComplaintId(req),
      req.auth,
      message,
    );
    res.status(200).json({ success: true, data: complaint });
  };

  public addResolutionNote = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { note } = addResolutionNoteSchema.parse(req.body);
    const complaint = await this.complaintService.addResolutionNote(
      this.getComplaintId(req),
      req.auth.userId,
      note,
    );
    res.status(200).json({ success: true, data: complaint });
  };

  public checkSimilar = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { title, description } = req.body;
    
    if (!title || !description) {
      throw new AppError('Title and description are required to detect similar complaints', 400, 'MISSING_DATA');
    }

    const duplicates = await this.complaintService.findSimilar(String(title), String(description));
    res.status(200).json({ success: true, data: duplicates });
  };

  public getMyComplaints = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const complaints = await this.complaintService.getMyComplaints(req.auth.userId);
    res.status(200).json({ success: true, data: complaints });
  };

  public getAllComplaints = async (_req: Request, res: Response): Promise<void> => {
    const complaints = await this.complaintService.getAllComplaints();
    res.status(200).json({ success: true, data: complaints });
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const complaint = await this.complaintService.getComplaintById(this.getComplaintId(req), req.auth);
    if (!complaint) throw new AppError('Complaint not found', 404, 'NOT_FOUND');
    res.status(200).json({ success: true, data: complaint });
  };
}
