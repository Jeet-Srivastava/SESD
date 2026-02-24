import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('1d'),
  AI_PROVIDER: z.string().default('mock'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

export type AppEnv = z.infer<typeof envSchema>;
export const env: AppEnv = envSchema.parse(process.env);
