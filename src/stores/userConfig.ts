import { defineStore } from 'pinia';
import { DDA_MOD_ID, KEY_USER_CONFIG, LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';

export const useUserConfigStore = defineStore(KEY_USER_CONFIG, {
  state: initUserConfig,
  actions: {
    selectLanguage(newLanguageCode: string) {
      this.languageCode = newLanguageCode;
    },
    selectVersion(newVersionId: string) {
      this.versionId = newVersionId;
    },
    selectMods(newModIds: string[]) {
      this.modIds.splice(0, this.modIds.length, ...newModIds);
    },
  },
});

function initUserConfig(): { versionId: string; languageCode: string; modIds: string[] } {
  const userConfigValue = localStorage.getItem(KEY_USER_CONFIG);
  if (userConfigValue) {
    return JSON.parse(userConfigValue);
  } else {
    return {
      versionId: LATEST_VERSION,
      languageCode: LANGUAGE_OPTIONS[0].value,
      modIds: [DDA_MOD_ID],
    };
  }
}

useUserConfigStore().$subscribe((mutation, state) => {
  const stateJson = JSON.stringify(state);
  console.debug('Save new user config \n%s', stateJson);
  localStorage.setItem(KEY_USER_CONFIG, stateJson);
});
