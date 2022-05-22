import { defineStore } from 'pinia';
import { getAllJsonItems } from 'src/apis/jsonItemApi';
import { getPoFileByVersionAndLanguageCode } from 'src/apis/poFileApi';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { DDA_MOD_ID, LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import {
  KEY_CONFIG_OPTIONS_VERSIONS,
  KEY_USER_CONFIG,
  KEY_USER_CONFIG_LANGUAGE_CODE,
  KEY_USER_CONFIG_VERSION_ID,
} from 'src/constants/storeConstant';
import { gettext } from 'src/gettext';
import { getJsonItemSetByVersionId, saveJsonItemSet } from 'src/services/jsonItemSetService';
import { getSavePoFileByVersion, savePoFile } from 'src/services/poFileService';
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
const userConfig = useUserConfigStore();

userConfig.$subscribe(async (mutation, state) => {
  const stateJson = JSON.stringify(state);
  const event = mutation.events;

  logger.debug('Save new user config \n', stateJson);
  localStorage.setItem(KEY_USER_CONFIG, stateJson);

  // userConfig's versionId is change
  if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_VERSION_ID) {
    await versionUpdate();
  } else if (!Array.isArray(event) && event.key === KEY_USER_CONFIG_LANGUAGE_CODE) {
    await languageUpdate();
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
  if (await hasVersionById(userConfig.versionId)) {
    logger.debug(`version id ${userConfig.versionId} is has in db.`);
    const dbJsonItemSet = await getJsonItemSetByVersionId(userConfig.versionId);
    if (dbJsonItemSet) {
      replaceArray(jsonItems, dbJsonItemSet.jsonItems);
    }
  } else {
    const newVersion = configOptions.findVersionById(userConfig.versionId);
    logger.debug(`version id ${userConfig.versionId} is no in db. start save`);
    if (newVersion) {
      const remoteJsonItems = await getAllJsonItems(newVersion);
      await saveJsonItemSet({ versionId: userConfig.versionId, jsonItems: remoteJsonItems });
      await saveVersion(newVersion);
      replaceArray(jsonItems, remoteJsonItems);
    } else {
      logger.error(`new version ${userConfig.versionId} is no find in config Options, Why?`);
    }
  }
  //language is base in version
  await languageUpdate();
  cddaItemIndexer.clear();
  cddaItemIndexer.addJsonItems(jsonItems);
  logger.debug(`addJsonItems end, mods ${cddaItemIndexer.modinfos.length}`, cddaItemIndexer.byModIdAndJsonTypeAndId);
  configOptions.updateMods(cddaItemIndexer.modinfos);
  cddaItemIndexer.processCopyFroms();
  logger.debug('init end');
}

async function languageUpdate() {
  logger.debug('start updateLanguage');
  if (userConfig.languageCode === LANGUAGE_OPTIONS[0].value) {
    logger.debug(`language code is ${userConfig.languageCode}, no need use gettext.`);
    gettext.clear();
    return;
  }
  let poStr = (await getSavePoFileByVersion(userConfig.versionId, userConfig.languageCode))?.po;
  if (poStr) {
    logger.debug('db has po ', userConfig.languageCode);
    gettext.changeGettext(poStr);
  } else {
    logger.debug('db no has po ', userConfig.languageCode);
    const version = configOptions.findVersionById(userConfig.versionId);
    if (version) {
      poStr = await getPoFileByVersionAndLanguageCode(version);
      await savePoFile({ versionId: userConfig.versionId, languageCode: userConfig.languageCode, po: poStr });
    } else {
      logger.error(`new version ${userConfig.versionId} is no find in config Options, Why?`);
    }
  }
  logger.debug('end updateLanguage');
}
