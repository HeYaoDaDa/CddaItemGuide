import { defineStore } from 'pinia';
import { getAllJsonItems } from 'src/apis/jsonItemApi';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { DDA_MOD_ID, LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import { KEY_CONFIG_OPTIONS_VERSIONS, KEY_USER_CONFIG, KEY_USER_CONFIG_VERSION_ID } from 'src/constants/storeConstant';
import { getJsonItemSetByVersionId, saveJsonItemSet } from 'src/services/jsonItemSetService';
import { hasVersionById, saveVersion } from 'src/services/versionsService';
import { JsonItem } from 'src/types/JsonItem';
import { replaceArray } from 'src/utils/commonUtil';
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
const userConfigOptions = useUserConfigStore();

userConfigOptions.$subscribe(async (mutation, state) => {
  const stateJson = JSON.stringify(state);
  const event = mutation.events;

  logger.debug('Save new user config \n', stateJson);
  localStorage.setItem(KEY_USER_CONFIG, stateJson);

  // userConfig's versionId is change
  if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_VERSION_ID) {
    await versionUpdate();
  }
});

configOptions.$subscribe(async (mutation, state) => {
  const event = mutation.events;
  const userConfig = useUserConfigStore();

  if (!Array.isArray(event) && event.key === KEY_CONFIG_OPTIONS_VERSIONS) {
    // in options update, change default versionId
    if (userConfig.versionId === LATEST_VERSION) {
      logger.debug('change lastest version to normal version');
      userConfig.selectVersion(state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r)).id);
    } else {
      // init start, because configOptions can update version
      await versionUpdate();
    }
  }
});

async function versionUpdate() {
  const jsonItems = [] as JsonItem[];
  if (await hasVersionById(userConfigOptions.versionId)) {
    logger.debug(`version id ${userConfigOptions.versionId} is has in db.`);
    const dbJsonItemSet = await getJsonItemSetByVersionId(userConfigOptions.versionId);
    if (dbJsonItemSet) {
      replaceArray(jsonItems, dbJsonItemSet.jsonItems);
    }
  } else {
    const newVersion = configOptions.findVersionById(userConfigOptions.versionId);
    logger.debug(`version id ${userConfigOptions.versionId} is no in db. start save`);
    if (newVersion) {
      const remoteJsonItems = await getAllJsonItems(newVersion);
      await saveJsonItemSet({ versionId: userConfigOptions.versionId, jsonItems: remoteJsonItems });
      await saveVersion(newVersion);
      replaceArray(jsonItems, remoteJsonItems);
    } else {
      logger.error(`new version ${userConfigOptions.versionId} is no find in config Options, Why?`);
    }
  }
  cddaItemIndexer.clear();
  cddaItemIndexer.addJsonItems(jsonItems);
  configOptions.updateMods(cddaItemIndexer.modinfos);
}
