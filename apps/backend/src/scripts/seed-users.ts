import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectMongo } from '../infrastructure/database/mongoose.js';
import { UserModel } from '../modules/users/user.model.js';
import { UserRole } from '../shared/types/roles.js';

interface SeedUserInput {
  email?: string;
  password?: string;
  name?: string;
  role: UserRole;
}

const seedUser = async ({ email, password, name, role }: SeedUserInput): Promise<void> => {
  if (!email || !password) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await UserModel.findOneAndUpdate(
    { email },
    {
      name: name ?? `${role.toLowerCase()} user`,
      email,
      passwordHash,
      role,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.info(`[seed] upserted ${role} user: ${email}`);
};

const run = async (): Promise<void> => {
  if (!process.env.SEED_ADMIN_EMAIL && !process.env.SEED_STAFF_EMAIL) {
    throw new Error('Provide SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD and/or SEED_STAFF_EMAIL/SEED_STAFF_PASSWORD');
  }

  await connectMongo();
  console.info(`[seed] connected using ${env.MONGODB_URI}`);

  await seedUser({
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    name: process.env.SEED_ADMIN_NAME,
    role: UserRole.ADMIN,
  });

  await seedUser({
    email: process.env.SEED_STAFF_EMAIL,
    password: process.env.SEED_STAFF_PASSWORD,
    name: process.env.SEED_STAFF_NAME,
    role: UserRole.STAFF,
  });

  await mongoose.disconnect();
  console.info('[seed] done');
};

run().catch(async (error: Error) => {
  console.error('[seed] failed', error.message);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
