import { boot } from 'quasar/wrappers';
import { createLogger, StringifyAndParseObjectsHook } from 'vue-logger-plugin';

const logger = createLogger({
  enabled: true,
  level: 'debug',
  callerInfo: true,
  beforeHooks: [StringifyAndParseObjectsHook],
});

export default boot(({ app }) => {
  app.use(logger);
});

export { logger };
