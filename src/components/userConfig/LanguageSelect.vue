<template>
  <q-select filled v-model="selectedLanguage" :options="LANGUAGE_OPTIONS" emit-value map-options options-dense>
    <template v-slot:prepend> <q-icon name="language" /> </template>
  </q-select>
</template>

<script setup lang="ts">
import { Quasar } from 'quasar';
import { logger } from 'src/boot/logger';
import { LANGUAGE_OPTIONS } from 'src/constants/appConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
const userConfig = useUserConfigStore();

/**
 * change vue18n and quasar language setting
 * @param newLanguageCode new Language Code
 */
function changeLanguage(newLanguageCode: string) {
  locale.value = newLanguageCode;
  void import('quasar/lang/' + newLanguageCode).then((lang: typeof import('quasar/lang/*')) => {
    Quasar.lang.set(lang.default);
  });
}

changeLanguage(userConfig.languageCode);

const selectedLanguage = computed({
  get: () => userConfig.languageCode,
  set: (val) => {
    logger.debug('user change to new language ', val);
    userConfig.selectLanguage(val);
    changeLanguage(val);
  },
});
</script>
