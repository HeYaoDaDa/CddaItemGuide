import { defineStore } from 'pinia';
import { getVersions } from 'src/apis/versionApi';
import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { BaseMod } from 'src/classes/base/BaseMod';
import { Version } from 'src/classes/base/Version';
import { LANGUAGE_OPTIONS, LATEST_VERSION } from 'src/constants/appConstant';
import { KEY_CONFIG_OPTIONS_VERSIONS, KEY_USER_CONFIG_OPTIONS } from 'src/constants/storeConstant';
import { initGettext } from 'src/services/poFileService';
import { isEmpty } from 'src/utils';
import { useUserConfigStore } from './userConfig';

export const useConfigOptionsStore = defineStore(KEY_USER_CONFIG_OPTIONS, {
  state: () => {
    return {
      versions: [] as Version[],
      languages: LANGUAGE_OPTIONS,
      mods: new Map<string, BaseMod>(),
    };
  },
  getters: {
    lastestVersion(state): Version | undefined {
      if (isEmpty(state.versions)) return;
      return state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r));
    },
  },
  actions: {
    /**
     * init step 1
     */
    async initVersions() {
      const start = performance.now();
      myLogger.debug('start init versions');
      const versions = await getVersions();
      useConfigOptionsStore().updateVersions(versions);
      const end = performance.now();
      myLogger.debug(`init versions success, cost time is ${end - start}ms, all versions size is ${versions.length}`);
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
      myLogger.debug('start init mods');
      const newMods = cddaItemIndexer.modinfos.map((jsonItem) => {
        const mod = new BaseMod(jsonItem);
        if (!Array.isArray(mod.dependencies)) mod.dependencies = [mod.dependencies];
        return mod;
      });
      this.mods.clear();
      newMods.forEach((newMod) => this.mods.set(newMod.id.toLowerCase(), newMod));
      myLogger.debug('init mods success, mods size is ', newMods.length);
    },
    findModById(modId: string) {
      return this.mods.get(modId.toLowerCase());
    },
  },
});

useConfigOptionsStore().$subscribe(async (mutation, state) => {
  const event = mutation.events;
  const userConfig = useUserConfigStore();

  if (!Array.isArray(event) && event.key === KEY_CONFIG_OPTIONS_VERSIONS) {
    if (userConfig.versionId === LATEST_VERSION) {
      myLogger.debug('change lastest version to normal version');
      userConfig.selectVersion(state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r)).id);
      myLogger.debug('normal version is ', userConfig.versionId);
    } else {
      await Promise.all([cddaItemIndexer.init(), initGettext()]);
    }
  }
});
