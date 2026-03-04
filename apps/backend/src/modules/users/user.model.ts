import { Schema, model } from 'mongoose';
import { UserRole } from '../../shared/types/roles.js';

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
