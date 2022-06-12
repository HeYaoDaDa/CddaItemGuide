import { myLogger } from 'src/boot/logger';

export const DEFAULT_CATCH = (e: unknown) => myLogger.error(e);
