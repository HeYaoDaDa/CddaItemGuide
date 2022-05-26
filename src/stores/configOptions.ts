import { defineStore } from 'pinia';
import { getVersions } from 'src/apis/versionApi';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import { KEY_CONFIG_OPTIONS_VERSIONS, KEY_USER_CONFIG_OPTIONS } from 'src/constants/storeConstant';
import { initGettext } from 'src/services/poFileService';
import { BaseMod } from 'src/types/BaseMod';
import { Version } from 'src/types/Version';
import { arrayIsEmpty } from 'src/utils/commonUtil';
import { useUserConfigStore } from './userConfig';

export const useConfigOptionsStore = defineStore(KEY_USER_CONFIG_OPTIONS, {
  state: () => {
    return {
      versions: [] as Version[],
      languages: LANGUAGE_OPTIONS,
      mods: [] as BaseMod[],
    };
  },
  getters: {
    lastestVersion(state): Version | undefined {
      if (arrayIsEmpty(state.versions)) return;
      return state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r));
    },
  },
  actions: {
    /**
     * init step 1
     */
    async initVersions() {
      const start = performance.now();
      logger.debug('start init versions');
      const versions = await getVersions();
      useConfigOptionsStore().updateVersions(versions);
      const end = performance.now();
      logger.debug(`init versions success, cost time is ${end - start}ms, all versions size is ${versions.length}`);
    },
    updateVersions(newVersions: Version[]) {
      this.versions = newVersions;
    },
    findVersionById(id: string) {
      return this.versions.find((version) => version.id === id);
    },
    findLanguageByCode(code: string) {
      return this.languages.find((language) => language.value === code);
    },
    /**
     * after cddaItemIndexer prepare, because need modinfos
     */
    updateMods() {
      logger.debug('start init mods');
      const newMods = cddaItemIndexer.modinfos.map((jsonItem) => {
        const mod = new BaseMod(jsonItem);
        if (!Array.isArray(mod.dependencies)) mod.dependencies = [mod.dependencies];
        return mod;
      });
      this.mods = newMods;
      logger.debug('init mods success, mods size is ', newMods.length);
    },
    findModById(modId: string) {
      return this.mods.find((mod) => mod.id.toLowerCase() === modId.toLowerCase());
    },
  },
});

useConfigOptionsStore().$subscribe(async (mutation, state) => {
  const event = mutation.events;
  const userConfig = useUserConfigStore();

  if (!Array.isArray(event) && event.key === KEY_CONFIG_OPTIONS_VERSIONS) {
    if (userConfig.versionId === LATEST_VERSION) {
      logger.debug('change lastest version to normal version');
      userConfig.selectVersion(state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r)).id);
      logger.debug('normal version is ', userConfig.versionId);
    } else {
      await Promise.all([initGettext(), cddaItemIndexer.init()]);
    }
  }
});
