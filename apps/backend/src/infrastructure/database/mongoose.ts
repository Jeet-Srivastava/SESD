import mongoose from 'mongoose';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export const connectMongo = async (): Promise<void> => {
  try {

    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
    };

    await mongoose.connect(env.MONGODB_URI, options);
    
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', {
      nodeVersion: process.version,
      hint: 'Use Node 20.x or 22.x LTS and ensure Atlas network access allows your current public IP.',
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};