import { Schema, Types, model } from 'mongoose';
import { ComplaintPriority, ComplaintStatus } from '../../shared/types/roles.js';

export interface ComplaintComment {
  message: string;
  authorId: Types.ObjectId;
  createdAt: Date;
}

export interface ComplaintDocument {
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  imageUrls: string[];
  aiHints?: string;
  comments: ComplaintComment[];
  resolutionNote?: string;
  escalationLevel: number;
  authorId: Types.ObjectId;
  assigneeId?: Types.ObjectId;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const complaintCommentSchema = new Schema<ComplaintComment>({
  message: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const complaintSchema = new Schema<ComplaintDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.CREATED },
    priority: { type: String, enum: Object.values(ComplaintPriority), default: ComplaintPriority.MEDIUM },
    imageUrls: [{ type: String }],
    aiHints: { type: String },
    comments: [complaintCommentSchema],
    resolutionNote: { type: String },
    escalationLevel: { type: Number, default: 0 },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true },
);

export const ComplaintModel = model<ComplaintDocument>('Complaint', complaintSchema);
