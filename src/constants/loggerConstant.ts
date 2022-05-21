import { logger } from 'src/boot/logger';

export const DEFAULT_CATCH = (e: unknown) => logger.error(e);
