import { defineStore } from 'pinia';
import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { DDA_MOD_ID, LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import {
  KEY_USER_CONFIG,
  KEY_USER_CONFIG_LANGUAGE_CODE,
  KEY_USER_CONFIG_VERSION_ID,
} from 'src/constants/storeConstant';
import { initGettext } from 'src/services/poFileService';

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

const userConfig = useUserConfigStore();

userConfig.$subscribe(async (mutation, state) => {
  const stateJson = JSON.stringify(state);
  const event = mutation.events;

  myLogger.debug('Save new user config \n', stateJson);
  localStorage.setItem(KEY_USER_CONFIG, stateJson);

  if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_VERSION_ID) {
    await Promise.all([cddaItemIndexer.init(), initGettext()]);
  } else if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_LANGUAGE_CODE) {
    await initGettext();
  }
});
