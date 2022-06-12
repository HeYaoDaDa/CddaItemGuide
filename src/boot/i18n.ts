import { boot } from 'quasar/wrappers';
import messages from 'src/i18n';
import { createI18n } from 'vue-i18n';

const globalI18n = createI18n({
  locale: 'en-US',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

export default boot(({ app }) => {
  app.use(globalI18n);
});

export { globalI18n };
