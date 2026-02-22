type LogContext = Record<string, unknown>;

const serialize = (context?: LogContext): string => {
  if (!context) {
    return '';
  }
  return ` ${JSON.stringify(context)}`;
};

export const logger = {
  info: (message: string, context?: LogContext): void => {
    console.info(`[INFO] ${new Date().toISOString()} ${message}${serialize(context)}`);
  },
  error: (message: string, context?: LogContext): void => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}${serialize(context)}`);
  },
  warn: (message: string, context?: LogContext): void => {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}${serialize(context)}`);
  },
};
