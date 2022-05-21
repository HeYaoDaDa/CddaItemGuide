import { defineStore } from 'pinia';
import { getAllJsonItems } from 'src/apis/jsonItemApi';
import { logger } from 'src/boot/logger';
import { DDA_MOD_ID, LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import { KEY_USER_CONFIG, KEY_USER_CONFIG_VERSION_ID } from 'src/constants/storeConstant';
import { saveJsonItemSet } from 'src/services/jsonItemSetService';
import { hasVersionById, saveVersion } from 'src/services/versionsService';
import { useConfigOptionsStore } from './configOptions';

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

const configOptions = useConfigOptionsStore();

useUserConfigStore().$subscribe(async (mutation, state) => {
  const stateJson = JSON.stringify(state);
  const event = mutation.events;

  logger.debug('Save new user config \n', stateJson);
  localStorage.setItem(KEY_USER_CONFIG, stateJson);

  // userConfig's versionId is change
  if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_VERSION_ID) {
    const newVersion = configOptions.findVersionById(state.versionId);
    logger.debug("user config's version is change");
    if (await hasVersionById(state.versionId)) {
      logger.debug(`version id ${state.versionId} is has in db.`);
    } else {
      logger.debug(`version id ${state.versionId} is no in db. start save`);
      if (newVersion) {
        const remoteJsonItems = await getAllJsonItems(newVersion);
        await saveJsonItemSet({ versionId: state.versionId, jsonItems: remoteJsonItems });
        await saveVersion(newVersion);
      } else {
        logger.error(`new version ${state.versionId} is no find in config Options, Why?`);
      }
    }
  }
});

configOptions.$subscribe((mutation, state) => {
  const userConfig = useUserConfigStore();
  // in options update, change default versionId
  if (userConfig.versionId === LATEST_VERSION) {
    logger.debug('change lastest version to normal version');
    userConfig.selectVersion(state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r)).id);
  }
});
