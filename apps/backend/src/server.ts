import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectMongo } from './infrastructure/database/mongoose.js';
import { EscalationCron } from './infrastructure/cron/escalation.cron.js';

const startServer = async (): Promise<void> => {
  await connectMongo();
  const app = createApp();

  const escalationCron = new EscalationCron();
  escalationCron.start();

  app.listen(env.PORT, () => {
    console.info(`[backend] server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
};

startServer().catch((error: Error) => {
  console.error('[backend] startup failed', error);
  process.exit(1);
});
