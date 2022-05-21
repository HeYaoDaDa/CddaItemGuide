import { defineStore } from 'pinia';
import { getVersions } from 'src/apis/versionApi';
import { KEY_USER_CONFIG_OPTIONS, LANGUAGE_OPTIONS } from 'src/constants/appConstant';
import { BaseMod } from 'src/types/BaseMod';
import { Version } from 'src/types/Version';
import { arrayIsEmpty } from 'src/utils/commonUtil';

export const useConfigOptionsStore = defineStore(KEY_USER_CONFIG_OPTIONS, {
  state: initConfigValue,
  getters: {
    lastestVersion(state): Version | undefined {
      if (arrayIsEmpty(state.versions)) return;
      return state.versions.reduce((l, r) => (l.publishDate > r.publishDate ? l : r));
    },
  },
  actions: {
    updateVersions(newVersions: Version[]) {
      this.versions.splice(0, this.versions.length, ...newVersions);
    },
    findVersionById(id: string) {
      return this.versions.find((version) => version.id === id);
    },
    findLanguageByCode(code: string) {
      return this.languages.find((language) => language.value === code);
    },
    findModById(id: string) {
      return this.mods.find((mod) => mod.id === id);
    },
  },
});

function initConfigValue() {
  return {
    versions: [] as Version[],
    languages: LANGUAGE_OPTIONS,
    mods: [] as BaseMod[],
  };
}

loadVersion();

async function loadVersion() {
  const versions = await getVersions();
  useConfigOptionsStore().updateVersions(versions);
}
