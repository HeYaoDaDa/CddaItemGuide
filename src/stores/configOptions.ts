import { defineStore } from 'pinia';
import { LANGUAGE_OPTIONS } from 'src/constants/appConstant';
import { KEY_USER_CONFIG_OPTIONS } from 'src/constants/storeConstant';
import { BaseMod } from 'src/types/BaseMod';
import { JsonItem } from 'src/types/JsonItem';
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
      this.versions = newVersions;
    },
    findVersionById(id: string) {
      return this.versions.find((version) => version.id === id);
    },
    findLanguageByCode(code: string) {
      return this.languages.find((language) => language.value === code);
    },
    //TODO:todo
    updateMods(newModJsonItems: JsonItem[]) {
      const newMods = newModJsonItems.map((jsonItem) => {
        const mod = new BaseMod(jsonItem);
        if (!Array.isArray(mod.dependencies)) mod.dependencies = [mod.dependencies];
        return mod;
      });
      this.mods = newMods;
    },
    findModById(modId: string) {
      return this.mods.find((mod) => mod.id.toLowerCase() === modId.toLowerCase());
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
