import { myLogger } from 'src/boot/logger';
import { GettextString } from 'src/classes/items';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { isNotEmpty } from 'src/utils';
import { getArray, getBoolean, getString } from 'src/utils/json';
import { getCddaSubItem } from 'src/utils/json/dataJsonUtil';
import { JsonItem } from './JsonItem';

export class BaseMod {
  id: string;
  name: GettextString;
  obsolete: boolean;
  dependencies: string[];

  //cache, is order, base is front
  private dependcncyMods?: BaseMod[];

  constructor(jsonItem: JsonItem) {
    const jsonObject = jsonItem.json;

    this.id = getString(jsonObject, 'id');
    this.name = getCddaSubItem(jsonObject, 'name', new GettextString());
    this.obsolete = getBoolean(jsonObject, 'obsolete');
    this.dependencies = getArray(jsonObject, 'dependencies').map((v) => v as string);
  }

  getDependencyMods() {
    if (this.dependcncyMods) return this.dependcncyMods;
    const result = new Array<BaseMod>();

    if (isNotEmpty(this.dependencies)) {
      const configOptions = useConfigOptionsStore();

      this.dependencies.forEach((dependencyModId) => {
        const dependencyMod = configOptions.findModById(dependencyModId);

        if (dependencyMod) {
          result.push(dependencyMod, ...dependencyMod.getDependencyMods());
        } else {
          myLogger.warn(`${this.id}'s dependency mod ${dependencyModId} is miss.`);
        }
      });
    }

    return result.reverse();
  }
}
