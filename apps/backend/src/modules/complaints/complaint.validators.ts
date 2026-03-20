import { z } from 'zod';
import { ComplaintStatus } from '../../shared/types/roles.js';

export const createComplaintSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
  imageUrls: z.array(z.string()).default([]),
});

export const statusUpdateSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
});

export const assignComplaintSchema = z.object({
  assigneeId: z.string().min(1),
});

export const addCommentSchema = z.object({
  message: z.string().min(2),
});

export const addResolutionNoteSchema = z.object({
  note: z.string().min(5),
});

